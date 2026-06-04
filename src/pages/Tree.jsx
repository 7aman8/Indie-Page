import React, { useState, useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import gsap from 'gsap';
import SEO from '@/components/SEO';

// Mockup Imports
import ProlensesImg from '../assets/Mockups/Prolenses.webp';
import GAImg from '../assets/Mockups/GA.webp';
import ShareboardImg from '../assets/Mockups/Shareboard.webp';
import MahaliImg from '../assets/Mockups/Mahali.webp';

import SuccessMessage from '../components/SuccessMessage';

const projects = [
  {
    id: "01",
    title: "Prolenses",
    hook: "prolenses.media",
    category: "Fullstack Development",
    src: ProlensesImg,
    link: "https://prolenses.arjbuilds.dev"
  },
  {
    id: "02",
    title: "Goamplify Concept",
    hook: "goamplify.agency",
    category: "Concept & Design",
    src: GAImg,
    link: "https://goamplify.arjbuilds.dev"
  },
  {
    id: "03",
    title: "ShareBoard Colloaborative Platform",
    hook: "shareboard.space",
    category: "Fullstack Development",
    src: ShareboardImg,
    link: "https://shareboard.space"
  },
  {
    id: "04",
    title: "Mahali E-Commerce",
    hook: "mahali.food",
    category: "Fullstack Development",
    src: MahaliImg,
    link: "https://mahali.food"
  },
];

function ArrowIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ContactForm() {
  const [state, handleSubmit] = useForm("xdkqvopn");
  const [topic, setTopic] = useState('');
  const inputTextClass = "text-lg md:text-2xl lg:text-3xl";

  return (
    <div className="w-full flex flex-col items-center justify-center relative font-gsans text-black bg-white min-h-[70vh] p-6 pb-20">
      <div className="w-full max-w-6xl flex-1 flex flex-col justify-center">
        {state.succeeded ? (
          <SuccessMessage />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 sm:gap-10 font-gilroy text-lg sm:text-2xl md:text-4xl lg:text-5xl leading-tight"
            autoComplete="off"
          >
            <div className="flex flex-col md:flex-row md:items-baseline flex-wrap gap-4 md:gap-6">
              <span className="font-normal">Hey, Abdulrahman! My name is</span>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className={`${inputTextClass} bg-transparent border-b border-black/20 focus:border-red-500 outline-none placeholder:text-black/40 px-2 py-1 w-full md:w-auto md:min-w-[300px] transition-colors`}
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} />
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline flex-wrap gap-4 md:gap-6">
              <span className="font-normal">and I am from</span>
              <input
                type="text"
                name="country"
                placeholder="Country"
                required
                className={`${inputTextClass} bg-transparent border-b border-black/20 focus:border-red-500 outline-none placeholder:text-black/40 px-2 py-1 w-full md:w-auto md:min-w-[200px] transition-colors`}
              />
              <ValidationError prefix="Country" field="country" errors={state.errors} />
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline flex-wrap gap-6">
              <span className="font-normal whitespace-nowrap">Let's connect about</span>
              <div className="flex flex-wrap gap-3">
                {['Collaboration', 'Potential Project', 'Networking'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    className={`px-6 py-2 rounded-full border text-xl md:text-2xl transition-all duration-300
                      ${topic === item
                        ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-300'
                        : 'text-black hover:bg-black/5 hover:border-black/20 border-black/10'
                      }`}
                  >
                    {item}
                  </button>
                ))}
                <input type="hidden" name="topic" value={topic} />
              </div>
              <ValidationError prefix="Topic" field="topic" errors={state.errors} />
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline flex-wrap gap-6">
              <span className="font-normal">We can talk at</span>
              <input
                type="email"
                name="email"
                placeholder="name@website.com"
                required
                className={`${inputTextClass} bg-transparent border-b border-black/20 focus:border-red-500 outline-none placeholder:text-black/40 px-2 py-1 flex-grow md:max-w-md transition-colors`}
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-6">
              <span className="font-normal whitespace-nowrap">In short,</span>
              <textarea
                rows={1}
                name="message"
                placeholder="Type your message..."
                required
                className={`${inputTextClass} bg-transparent border-b border-black/20 focus:border-red-500 outline-none placeholder:text-black/40 px-2 py-1 w-full resize-none overflow-hidden`}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            <div className="w-full flex justify-center mt-10">
              <button
                type="submit"
                className="group flex items-center gap-3 sm:gap-4 text-5xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter bg-transparent text-black"
              >
                <span>Send it</span>
                <span className="group-hover:-translate-y-2 group-hover:translate-x-2 sm:group-hover:-translate-y-4 sm:group-hover:translate-x-4 transition-transform duration-500 text-red-600">
                  <ArrowIcon className="w-8 h-8 sm:w-16 sm:h-16 md:w-24 md:h-24" />
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const Tree = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [localTime, setLocalTime] = useState('');
  const instagramRef = useRef(null);
  const xRef = useRef(null);
  const linkedinRef = useRef(null);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=[]{}|;:'<>,.?/~`";
  const scrambleText = (target, newText) => {
    let i = 0;
    gsap.to({}, {
      duration: 0.5,
      onUpdate: function () {
        let scrambled = "";
        for (let j = 0; j < newText.length; j++) {
          if (j < i) scrambled += newText[j];
          else scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        if (target) target.textContent = scrambled;
      },
      onComplete: function () {
        if (target) target.textContent = newText;
      },
    });

    let progress = { value: 0 };
    gsap.to(progress, {
      value: newText.length,
      duration: 0.5,
      roundProps: "value",
      onUpdate: () => i = progress.value
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Bahrain'
      }).toUpperCase());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const navClass = "hover:-translate-y-1 hover:text-red-500 transition-all duration-300 ease-in-out cursor-pointer inline-block";

  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-x-hidden relative font-gsans w-full mx-auto">
      <SEO 
        title="Links & Contact Tree | Abdulrahman Janahi"
        description="Connect directly with Abdulrahman Janahi (ARJ), professional web designer and developer in Bahrain. Request a branding or development project proposal."
        path="/tree"
      />

      {/* Header Navigation (Like Hero.jsx but acts as tabs) */}
      <nav className="flex flex-row font-gilroy font-bold gap-6 text-2xl md:text-3xl lg:text-4xl z-50 p-6 pt-10 pb-0">
        <a onClick={() => setActiveTab('about')} className={`${navClass} ${activeTab === 'about' ? 'text-red-700' : 'text-black'}`}>About</a>
        <a onClick={() => setActiveTab('contact')} className={`${navClass} ${activeTab === 'contact' ? 'text-red-700' : 'text-black'}`}>Contact</a>
      </nav>

      {/* Content Area */}
      <div className="flex-1 w-full bg-white relative">

        {/* ABOUT TAB */}
        <div className={`transition-opacity duration-500 ease-in-out ${activeTab === 'about' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>

          {/* Hero-like About Section */}
          <div className="p-6 pt-10">

            {/* Static version of DraggableLayer for mobile */}
            <div className="relative w-fit mb-6">
              <div className="absolute inset-0 flex items-center justify-center z-0 select-none opacity-50">
                <div className="flex flex-row font-gilroy font-bold items-end gap-2 p-4 text-gray-400">
                  <h1 className="text-3xl md:text-4xl -translate-x-6 md:-translate-x-8 font-mono leading-none">Indie Hacker</h1>
                </div>
              </div>
              <div className="relative z-10">
                <div className="relative border-2 bg-white border-[#008ef0] p-3 w-fit">
                  <span className="absolute -top-1.5 -left-1.5 w-2 h-2 bg-white border border-[#008ef0]"></span>
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-white border border-[#008ef0]"></span>
                  <span className="absolute -bottom-1.5 -left-1.5 w-2 h-2 bg-white border border-[#008ef0]"></span>
                  <span className="absolute -bottom-1.5 -right-1.5 w-2 h-2 bg-white border border-[#008ef0]"></span>
                  <div className="flex flex-row bg-white font-gilroy font-bold items-end gap-2 pointer-events-none">
                    <h1 className="text-3xl md:text-4xl font-gsans leading-none text-black">Fullstack Developer</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* About Text */}
            <div className="hero-text-p text-left text-lg md:text-xl opacity-60 mb-12">
              <p>I'm Abdulrahman Janahi.</p>
              <p>I build <span className='italic font-[Georgia]'>clean</span>, <span className='italic font-[Georgia]'>modern</span>, and <span className='italic font-[Georgia]'>engaging</span> web apps.</p>
            </div>

            {/* Projects */}
            <div className="w-full border-t border-black/10 pt-10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-6">Featured Work</h3>
              <div className="flex flex-col gap-6">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="relative w-full h-[350px] flex flex-col justify-end p-6 border-2 border-black/10 hover:border-black/30 group bg-zinc-100 overflow-hidden"
                  >
                    <img
                      src={project.src}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                    <div className="relative z-10 mb-2">
                      {/* <span className="font-mono text-[10px] text-red-400 mb-2 block uppercase tracking-wider">{project.category}</span> */}
                      <h2 className="text-3xl font-gilroy font-bold leading-tight mb-4 text-white">{project.title}</h2>
                      <div className="inline-block bg-white text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                        Visit Site
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* CONTACT TAB */}
        <div className={`transition-opacity duration-500 ease-in-out ${activeTab === 'contact' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Bottom Bar (Like Hero.jsx) */}
      <div className="w-full p-6 flex flex-col sm:flex-row justify-between items-start sm:items-end text-sm font-geist uppercase z-50 bg-white border-t border-black/10">
        {/* Location and Time */}
        <div className="whitespace-nowrap space-x-1 mb-4 sm:mb-0">
          <span className='text-red-600 font-bold'>
            <a href="https://en.wikipedia.org/wiki/Bahrain" target='_blank' rel="noreferrer">Bahrain</a>
          </span>
          <span>{localTime}</span>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap space-x-2 gap-1 text-black">
          <a
            ref={instagramRef}
            href="https://www.instagram.com/arjbuilds/"
            target='_blank'
            rel="noreferrer"
            className="hover:text-red-950 hover:font-semibold transition"
            onMouseEnter={() => scrambleText(instagramRef.current, 'INSTAGRAM')}
            onMouseLeave={() => instagramRef.current.textContent = 'INSTAGRAM'}
          >
            INSTAGRAM
          </a>

          <span className='opacity-50'>/</span>
          <a
            ref={xRef}
            href="https://x.com/ArjBuilds/"
            target='_blank'
            rel="noreferrer"
            className="hover:text-red-950 hover:font-semibold transition"
            onMouseEnter={() => scrambleText(xRef.current, 'X')}
            onMouseLeave={() => xRef.current.textContent = 'X'}
          >
            X
          </a>
          <span className='opacity-50'>/</span>

          <a
            ref={linkedinRef}
            href="https://www.linkedin.com/in/arj11/"
            target='_blank'
            rel="noreferrer"
            className="hover:text-red-950 hover:font-semibold transition"
            onMouseEnter={() => scrambleText(linkedinRef.current, 'LINKEDIN')}
            onMouseLeave={() => linkedinRef.current.textContent = 'LINKEDIN'}
          >
            LINKEDIN
          </a>
        </div>
      </div>

    </div>
  );
};

export default Tree;
