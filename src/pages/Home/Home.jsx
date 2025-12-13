import React from 'react';

import Hero from "./Hero";
import About from "./About";
import Work from "./Work";


function Home() {


  return (
    <>
        <Hero />

        <div className="bg-zinc-950 text-white relative z-20">
          <About />
          <Work />
      </div>
    
    </>
  );
}

export default Home;