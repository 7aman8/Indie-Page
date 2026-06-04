import React from 'react';

import Hero from "./Hero";
import Work from "./Work";
import Contact from "./Contact";
import Footer from "./Footer";

import StackingFlow from '@/components/StackingCards';


import SEO from '@/components/SEO';

function Home() {


  return (
    <div className='min-h-screen'>
        <SEO 
          title="Abdulrahman Janahi | Web Designer & Developer in Bahrain & GCC"
          description="Abdulrahman Janahi (ARJ) is a creative freelance web designer and developer building clean, modern, and engaging web apps in Bahrain and the GCC region."
          path="/"
        />
        <Hero />

        <div className="bg-zinc-950 text-white relative z-20">
          <Work />
          {/* <StackingFlow /> */}
          <Contact />
          <Footer />
        </div>
    
    </div>
  );
}

export default Home;