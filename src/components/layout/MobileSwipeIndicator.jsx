import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../../store/useConfigStore';

const MODULES = [
  { id: 'subtitle1', url: '/modelleme', labelKey: 'menu.modeling' },
  { id: 'subtitle2', url: '/simulasyon', labelKey: 'menu.simulation' },
  { id: 'subtitle3', url: '/ileri-malzeme', labelKey: 'menu.advanced_materials' },
  { id: 'subtitle4', url: '/yapay-zeka', labelKey: 'menu.ai' },
];

export const MobileSwipeIndicator = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const setSelectedPart = useConfigStore((state) => state.setSelectedPart);
  const setActivePage = useConfigStore((state) => state.setActivePage);

  const handleSelect = (module) => {
    if (selectedPart === module.id) {
      navigate('/');
      setSelectedPart(null);
    } else {
      navigate(module.url);
      setSelectedPart(module.id);
    }
  };

  const handleHomeClick = () => {
    setSelectedPart(null);
    setActivePage(null);
    navigate('/');
  };

  const isHome = selectedPart === null;

  return (
    <>
      {/* Sol Ekran Kenarı Swipe İpucu */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ x: [-4, 4, -4], opacity: [0.3, 0.7, 0.3] }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="fixed left-1.5 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center text-amber-400/70"
      >
        <svg width="14" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.div>

      {/* Sağ Ekran Kenarı Swipe İpucu */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ x: [4, -4, 4], opacity: [0.3, 0.7, 0.3] }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="fixed right-1.5 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center text-amber-400/70"
      >
        <svg width="14" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.div>

      {/* Tek Kompakt Alt Çubuk */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md pointer-events-auto select-none"
      >
        <div className="w-full bg-black/60 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center gap-1">
          {/* Home Butonu */}
          <button
            onClick={handleHomeClick}
            className={`flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
              isHome
                ? 'bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                : 'bg-white/5 border border-transparent text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>

          {/* Ayırıcı */}
          <div className="w-px h-6 bg-white/10 shrink-0" />

          {/* 4 Modül Butonları */}
          <div className="flex-1 flex items-center justify-around gap-1">
            {MODULES.map((item) => {
              const isSelected = selectedPart === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`relative flex-1 py-1.5 px-1 rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                      : 'bg-white/5 border border-transparent text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-amber-400 shadow-[0_0_8px_#ffb800] scale-125'
                          : 'bg-white/40'
                      }`}
                    />
                    <span className="font-display font-semibold text-[10px] tracking-wider truncate max-w-[62px]">
                      {t(item.labelKey)}
                    </span>
                  </div>

                  {/* Aktif Modül Alt Çizgi Vurgusu */}
                  {isSelected && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute -bottom-0.5 left-2 right-2 h-[2px] bg-amber-400 rounded-full shadow-[0_0_6px_#ffb800]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};
