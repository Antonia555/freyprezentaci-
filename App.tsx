import * as React from 'react';
import { useState, useEffect } from 'react';
import { SlideRenderer } from './components/SlideRenderer';
import { INITIAL_SLIDES } from './constants';
import { Slide } from './types';
import { CustomCursor } from './components/CustomCursor';

// Simple Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // We need to attach scroll listener to the MAIN element now, not window, because of snap overflow
  const mainRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setScrolled(mainRef.current.scrollTop > 50);
      }
    };
    const el = mainRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleSlideBackgroundUpdate = (index: number, file: File) => {
    const mediaUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');

    const newSlides = [...slides];
    if (isVideo) {
        newSlides[index] = {
            ...newSlides[index],
            backgroundVideo: mediaUrl,
            backgroundImage: undefined // Clear image if video is set
        };
    } else {
        newSlides[index] = {
            ...newSlides[index],
            backgroundImage: mediaUrl,
            backgroundVideo: undefined // Clear video if image is set
        };
    }
    setSlides(newSlides);
  };

  return (
    // Main container is now the scroll container for snapping
    <div id="main-scroll-container" ref={mainRef} className="font-sans text-stone-900 bg-stone-50 h-screen w-screen overflow-y-scroll snap-y snap-mandatory relative scroll-smooth cursor-none print:h-auto print:overflow-visible print:snap-none">
      <CustomCursor />
      
      {/* --- Navigation Bar --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 print:hidden ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-0' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Area */}
            <div className="flex-shrink-0 flex items-center cursor-none group" onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl mr-3 border-2 transition-colors ${scrolled ? 'bg-deepgreen-900 text-gold-500 border-gold-500' : 'bg-white/10 text-white border-white/30 backdrop-blur-sm'}`}>
                 F
               </div>
               <div>
                  <h1 className={`font-serif text-lg md:text-xl font-bold tracking-wide transition-colors ${scrolled ? 'text-deepgreen-900' : 'text-white drop-shadow-md'}`}>FREY MASSZÁZS</h1>
                  <p className={`text-[0.6rem] uppercase tracking-[0.1em] transition-colors ${scrolled ? 'text-gold-600' : 'text-gold-200'}`}>Oktatási & Egészség Stúdió</p>
               </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 cursor-none items-center">
              <button onClick={() => scrollToSection(1)} className={`cursor-none px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${scrolled ? 'text-stone-600 hover:text-gold-600' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Rólunk</button>
              <button onClick={() => scrollToSection(3)} className={`cursor-none px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${scrolled ? 'text-stone-600 hover:text-gold-600' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Az Ajánlat</button>
              <button onClick={() => scrollToSection(6)} className={`cursor-none px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${scrolled ? 'text-stone-600 hover:text-gold-600' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Előnyök</button>
              <button onClick={() => scrollToSection(9)} className={`cursor-none px-5 py-2 rounded-full text-sm font-medium uppercase tracking-wider shadow-lg transition-transform transform hover:scale-105 ${scrolled ? 'bg-deepgreen-900 hover:bg-deepgreen-800 text-white' : 'bg-gold-500 hover:bg-gold-400 text-deepgreen-900 border border-transparent'}`}>Kapcsolat</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 transition-colors ${scrolled ? 'text-stone-600' : 'text-white'} cursor-none`}>
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button onClick={() => scrollToSection(1)} className="block w-full text-left px-3 py-4 text-base font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-100 cursor-none">Rólunk</button>
              <button onClick={() => scrollToSection(3)} className="block w-full text-left px-3 py-4 text-base font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-100 cursor-none">Az Ajánlat</button>
              <button onClick={() => scrollToSection(6)} className="block w-full text-left px-3 py-4 text-base font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-100 cursor-none">Előnyök</button>
              <button onClick={() => scrollToSection(9)} className="block w-full text-left px-3 py-4 text-base font-medium text-gold-600 font-bold cursor-none">Kapcsolat</button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Main Content Sections --- */}
      <main className="pt-0">
        {slides.map((slide, index) => (
          <div id={`section-${index}`} key={slide.id}>
             <SlideRenderer 
                slide={slide} 
                isWebSection={true} 
                onUpload={(file) => handleSlideBackgroundUpdate(index, file)}
             />
          </div>
        ))}
      </main>

      {/* --- Footer (Also Snap Start) --- */}
      <footer className="bg-stone-900 text-white py-16 border-t-4 border-gold-500 snap-start h-screen flex flex-col justify-center relative cursor-none print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Brand */}
              <div className="space-y-4">
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-gold-200">FREY MASSZÁZS</h2>
                 <p className="text-sm font-medium text-gold-500 uppercase tracking-widest mb-4">Oktatási & Egészség Stúdió</p>
                 <p className="text-stone-400 leading-relaxed max-w-sm">
                    Minőségi masszőrképzés és egészségmegőrzés. Partneri együttműködés a kiválóság jegyében.
                 </p>
              </div>

              {/* Contact */}
              <div className="space-y-4 md:text-right">
                 <h3 className="text-lg font-bold uppercase tracking-widest text-gold-500 mb-6">Kapcsolat</h3>
                 <div className="flex items-center space-x-3 text-stone-300 md:justify-end">
                    <MailIcon />
                    <span>info@freymasszazs.hu</span>
                 </div>
                 <div className="flex items-center space-x-3 text-stone-300 md:justify-end">
                    <GlobeIcon />
                    <a href="https://www.freymasszazs.hu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-none">www.freymasszazs.hu</a>
                 </div>
                 <div className="flex items-center space-x-3 text-stone-300 md:justify-end">
                    <PhoneIcon />
                    <span>+36 30 106 0810</span>
                 </div>
              </div>
           </div>

           <div className="mt-16 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
              &copy; {new Date().getFullYear()} Frey Masszázs Oktatási & Egészség Stúdió. Minden jog fenntartva.
           </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
