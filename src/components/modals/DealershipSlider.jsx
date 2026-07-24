import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

export const DealershipSlider = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const dealerships = [
    {
      id: "dechamps",
      name: t("dealerships.dechamps_name"),
      desc: `${t("dealerships.dechamps_desc1")}\n\n${t("dealerships.dechamps_desc2")}`,
      image: "/logo/dechamps.png", 
      url: "https://www.deschamps-systems.com/",
      video: "https://www.youtube.com/embed/ajXLjjIbrG0?start=15"
    },
    {
      id: "penta",
      name: t("dealerships.penta_name"),
      desc: `${t("dealerships.penta_desc1")}\n\n${t("dealerships.penta_desc2")}`,
      image: "/logo/penta.png", 
      url: "https://www.penta.com.tr/"
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === dealerships.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? dealerships.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (dealerships.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, dealerships.length]);

  const currentItem = dealerships[currentIndex];

  return (
    <div className="relative w-full min-h-[600px] h-auto md:h-[75vh] pb-24 md:pb-0 bg-transparent flex flex-col pt-8 md:pt-12 px-4 md:px-12 lg:px-24 select-none border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
        {/* New Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: "url('/img/product_background.png')" }}
        ></div>
      </div>

      {/* TOP HEADER */}
      <div className="relative z-20 flex justify-between items-start mb-8 md:mb-0 mt-4 md:mt-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-light tracking-[0.25em] md:tracking-[0.3em] uppercase drop-shadow-md">
            <span className="text-white">{t("pages.bayiliklerimiz_title_1")}</span><span className="text-[#ffb800]">{t("pages.bayiliklerimiz_title_2")}</span>
          </h1>
        </div>
        {/* 3x3 dot grid icon */}
        <div className="hidden md:grid grid-cols-3 gap-1 opacity-80 mt-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-[#ffb800] rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full relative mt-4 md:mt-0">
        
        {/* LEFT SIDE: Text Content */}
        <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col justify-center z-20 relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 uppercase tracking-widest drop-shadow-lg">
                {currentItem.name}
              </h2>
              
              <div className="w-12 h-0.5 bg-white/20 mb-6"></div>

              <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-sm font-light whitespace-pre-line">
                {currentItem.desc}
              </p>
              {currentItem.url && (
                <a 
                  href={currentItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-[#ffb800] hover:text-white transition-colors text-sm font-medium tracking-wider"
                >
                  Website
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER/RIGHT SIDE: Image or Video */}
        <div className="w-full md:w-1/2 lg:w-2/3 h-[40vh] md:h-full flex items-center justify-center z-10 mt-8 md:mt-0 relative pointer-events-auto px-2 md:px-8">
          <AnimatePresence mode="wait">
            {currentItem.video ? (
              <motion.div
                key={`vid-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 shadow-[0_0_30px_rgba(255,184,0,0.1)]"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={currentItem.video}
                  title={currentItem.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover"
                ></iframe>
              </motion.div>
            ) : (
              <motion.img
                key={`img-${currentIndex}`}
                src={currentItem.image}
                alt={currentItem.name}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="w-full h-full object-contain max-h-[500px] md:max-h-[600px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 items-center justify-center text-white/50 hover:border-[#ffb800] hover:text-[#ffb800] transition-colors z-30 bg-black/20 backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#ffb800]/50 items-center justify-center text-[#ffb800] hover:border-[#ffb800] hover:bg-[#ffb800]/10 transition-colors z-30 bg-black/20 backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute bottom-6 right-6 flex gap-3 z-30">
          <button
            onClick={prevSlide}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/50 hover:border-[#ffb800] hover:text-[#ffb800] transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-[#ffb800]/50 text-[#ffb800] hover:bg-[#ffb800]/10 transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      {/* PAGINATION LINES */}
      <div className="absolute bottom-6 right-1/2 translate-x-1/2 md:bottom-10 md:right-16 md:translate-x-0 flex items-center gap-2 z-30">
        {dealerships.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-[#ffb800]" : "w-4 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* CORNER DECORATIONS (Desktop Only) */}
      <div className="hidden md:block absolute top-6 left-6 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
      <div className="hidden md:block absolute bottom-6 right-6 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
      
    </div>
  );
};

export default DealershipSlider;
