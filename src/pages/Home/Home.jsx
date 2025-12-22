import React from 'react';

import Hero from "./Hero";
import About from "./About";
import Work from "./Work";
import Contact from "./Contact";
import Footer from "./Footer";

import StackingFlow from '@/components/StackingCards';


function Home() {


  return (
    <div className='min-h-screen'>
        <Hero />

        <div className="bg-zinc-950 text-white relative z-20">
          <About />
          <Work />
          {/* <StackingFlow /> */}
          <Contact />
          <Footer />
      </div>
    
    </div>
  );
}

export default Home;