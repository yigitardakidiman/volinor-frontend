import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const References = [
  { id: 1, name: "Kara Kuvvetleri Komutanlığı", logo: "/logo/kara.png" },
  { id: 2, name: "Asfat A.Ş", logo: "/logo/asfat.png" },
  /*{ id: 3, name: "TÜBİTAK MAM", logo: "/logo/tubitak.png" },*/
  { id: 4, name: "Makine ve Kimya Endüstrisi A.Ş", logo: "/logo/mke.png" },
  { id: 5, name: "Ermaksan ", logo: "/logo/ermaksan.png" },
  { id: 6, name: "Lingua Yayıncılık", logo: "/logo/lingua.png" },
];

export const ReferencesBox = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full min-h-[600px] h-[75vh] bg-transparent flex flex-col pt-8 md:pt-12 px-4 md:px-12 lg:px-24 select-none border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: "url('/img/product_background.png')" }}
        ></div>
      </div>

      {/* TOP HEADER */}
      <div className="relative z-20 flex justify-between items-start mb-8 md:mb-0 mt-4 md:mt-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-light tracking-[0.25em] md:tracking-[0.3em] uppercase drop-shadow-md">
            <span className="text-white">{t("pages.referanslar_title_1")}</span><span className="text-[#ffb800]">{t("pages.referanslar_title_2")}</span>
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
      <div className="flex-1 flex w-full h-full relative mt-4 md:mt-8 pb-12 md:pb-24 items-center justify-center z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 items-center justify-items-center w-full max-w-5xl">
          {References.map((ref, index) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-center w-full max-w-[200px] md:max-w-[250px] h-[120px] md:h-[160px] group cursor-pointer"
            >
              {ref.logo ? (
                <img
                  src={ref.logo}
                  alt={ref.name}
                  className="w-full h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-md"
                />
              ) : (
                <span className="text-white/40 text-xl font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors text-center">
                  {ref.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CORNER DECORATIONS (Desktop Only) */}
      <div className="hidden md:block absolute top-6 left-6 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
      <div className="hidden md:block absolute bottom-6 right-6 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
    </div>
  );
};

export default ReferencesBox;
