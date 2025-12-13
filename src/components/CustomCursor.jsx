import { useEffect, useRef } from 'react';

const FluidCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- CONFIGURATION ---
    let config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 1,
      VELOCITY_DISSIPATION: 0.2,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: true,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
    };

    let pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      down: false,
      moved: false,
      color: [30, 0, 300],
    };

    let splatStack = [];

    // --- WEBGL HELPERS ---
    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext('webgl2', params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl =
          canvas.getContext('webgl', params) ||
          canvas.getContext('experimental-webgl', params);

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );
      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    const { gl, ext } = getWebGLContext(canvas);

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 512;
      config.SHADING = false;
      config.BLOOM = false;
      config.SUNRAYS = false;
    }

    // --- SHADERS ---
    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
      }
      return shader;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }`
    );

    const displayShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uBloom;
      uniform sampler2D uSunrays;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;
              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);
              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);
              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif
          #ifdef BLOOM
              vec3 bloom = texture2D(uBloom, vUv).rgb;
          #endif
          #ifdef SUNRAYS
              float sunrays = texture2D(uSunrays, vUv).r;
              c *= sunrays;
              #ifdef BLOOM
                  bloom *= sunrays;
              #endif
          #endif
          #ifdef BLOOM
              float noise = texture2D(uDithering, vUv * ditherScale).r;
              noise = noise * 2.0 - 1.0;
              bloom += noise / 255.0;
              bloom = pow(bloom.rgb, vec3(1.0 / 2.2));
              c += bloom;
          #endif
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }`;

    const splatShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }`;

    const advectionShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
          gl_FragColor.a = 1.0;
      }`;

    const divergenceShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`;

    const curlShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }`;

    const vorticityShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`;

    const pressureShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }`;

    const gradientSubtractShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`;

    // --- PROGRAM CLASS ---
    class Program {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          throw gl.getProgramInfoLog(this.program);

        const uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i).name;
          this.uniforms[uniformName] = gl.getUniformLocation(
            this.program,
            uniformName
          );
        }
      }
      bind() {
        gl.useProgram(this.program);
      }
    }

    // --- COMPILE PROGRAMS ---
    const displayShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, displayShaderSource)
    );
    const splatShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, splatShaderSource)
    );
    const advectionShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, advectionShaderSource)
    );
    const divergenceShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource)
    );
    const curlShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, curlShaderSource)
    );
    const vorticityShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource)
    );
    const pressureShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, pressureShaderSource)
    );
    const gradientSubtractShader = new Program(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource)
    );

    // --- TEXTURES & FBO ---
    let dye;
    let velocity;
    let divergence;
    let curl;
    let pressure;
    let bloom;
    let sunrays;
    let ditheringTexture;

    function initFramebuffers() {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      gl.disable(gl.BLEND);

      if (!dye)
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      else
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );

      if (!velocity)
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      else
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );

      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      if (target.width === w && target.height === h) return target;
      target.read = createFBO(w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      let min = Math.round(resolution);
      let max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
      else return { width: min, height: max };
    }

    // --- MAIN LOOP ---
    function updateKeywords() {
      let displayKeywords = [];
      if (config.SHADING) displayKeywords.push('SHADING');
      if (config.BLOOM) displayKeywords.push('BLOOM');
      if (config.SUNRAYS) displayKeywords.push('SUNRAYS');
    }

    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorIndex = 0;

    function update() {
      const dt = Math.min((Date.now() - lastUpdateTime) / 1000, 0.016);
      lastUpdateTime = Date.now();

      gl.viewport(0, 0, velocity.width, velocity.height);

      advectionShader.bind();
      gl.uniform2f(
        advectionShader.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(advectionShader.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionShader.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionShader.uniforms.dt, dt);
      gl.uniform1f(
        advectionShader.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity.write);
      velocity.swap();

      gl.viewport(0, 0, dye.width, dye.height);
      gl.uniform1i(advectionShader.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionShader.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(
        advectionShader.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(dye.write);
      dye.swap();

      gl.viewport(0, 0, velocity.width, velocity.height);
      curlShader.bind();
      gl.uniform2f(
        curlShader.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(curlShader.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityShader.bind();
      gl.uniform2f(
        vorticityShader.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(vorticityShader.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityShader.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityShader.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityShader.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceShader.bind();
      gl.uniform2f(
        divergenceShader.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(divergenceShader.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      pressureShader.bind();
      gl.uniform2f(
        pressureShader.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(pressureShader.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureShader.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractShader.bind();
      gl.uniform2f(
        gradientSubtractShader.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        gradientSubtractShader.uniforms.uPressure,
        pressure.read.attach(0)
      );
      gl.uniform1i(
        gradientSubtractShader.uniforms.uVelocity,
        velocity.read.attach(1)
      );
      blit(velocity.write);
      velocity.swap();

      gl.viewport(0, 0, dye.width, dye.height);
      splatShader.bind();
      gl.uniform1i(splatShader.uniforms.uTarget, dye.read.attach(0));
      gl.uniform1f(
        splatShader.uniforms.aspectRatio,
        canvas.width / canvas.height
      );
      gl.uniform2f(
        splatShader.uniforms.point,
        pointer.x / canvas.width,
        1.0 - pointer.y / canvas.height
      );
      gl.uniform3f(
        splatShader.uniforms.color,
        pointer.dx,
        pointer.dy,
        0.0 // Removed extra z coord for simple splash
      );
      gl.uniform1f(
        splatShader.uniforms.radius,
        config.SPLAT_RADIUS / 100.0
      );

      // Apply multiple splats
      if (splatStack.length > 0) {
        for (let i = 0; i < splatStack.length; i++) {
          const x = splatStack[i].x;
          const y = splatStack[i].y;
          const dx = splatStack[i].dx;
          const dy = splatStack[i].dy;
          const color = splatStack[i].color;
          gl.uniform2f(splatShader.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
          gl.uniform3f(splatShader.uniforms.color, dx, dy, 1.0); // simple flash
          gl.uniform1f(splatShader.uniforms.radius, config.SPLAT_RADIUS / 100.0);
          blit(dye.write);
          dye.swap();
        }
        splatStack = [];
      }
      
      // Handle mouse movement
      if (pointer.moved) {
        gl.uniform2f(splatShader.uniforms.point, pointer.x / canvas.width, 1.0 - pointer.y / canvas.height);
        gl.uniform3f(splatShader.uniforms.color, pointer.color[0], pointer.color[1], pointer.color[2]);
        gl.uniform1f(splatShader.uniforms.radius, config.SPLAT_RADIUS / 100.0);
        blit(dye.write);
        dye.swap();
        pointer.moved = false;
      }

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayShader.bind();
      gl.uniform1i(displayShader.uniforms.uTexture, dye.read.attach(0));
      blit(null);

      requestAnimationFrame(update);
    }

    function blit(destination) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination ? destination.fbo : null);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // --- INPUT HANDLING ---
    function updatePointer(x, y) {
      pointer.moved = true;
      pointer.dx = (x - pointer.x) * config.SPLAT_FORCE;
      pointer.dy = (y - pointer.y) * config.SPLAT_FORCE;
      pointer.x = x;
      pointer.y = y;
      colorIndex = (colorIndex + config.COLOR_UPDATE_SPEED * 0.1) % 360;
      pointer.color = generateColor(colorIndex);
    }

    function generateColor(hue) {
        // Simple HSV to RGB conversion for colorful cursor
        let s = 1.0; 
        let v = 1.0; 
        let c = v * s;
        let h = hue / 60;
        let x = c * (1 - Math.abs((h % 2) - 1));
        let m = v - c;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 1) { r = c; g = x; b = 0; }
        else if (1 <= h && h < 2) { r = x; g = c; b = 0; }
        else if (2 <= h && h < 3) { r = 0; g = c; b = x; }
        else if (3 <= h && h < 4) { r = 0; g = x; b = c; }
        else if (4 <= h && h < 5) { r = x; g = 0; b = c; }
        else if (5 <= h && h < 6) { r = c; g = 0; b = x; }
        
        return [r, g, b];
    }

    const onMouseMove = (e) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.targetTouches[0];
      updatePointer(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    // Initial setup
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    update();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FluidCursor;