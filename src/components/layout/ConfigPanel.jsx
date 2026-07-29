/**
 * ConfigPanel.jsx
 * Ana kullanıcı arayüzü (UI) kapsayıcısıdır. Ekranda görünen tüm düğmeleri, menüleri
 * ve bilgi panellerini (SidebarMenu, CircularMenu, PageModal) bir araya getirerek
 * son kullanıcıya sunar.
 */
import { motion, AnimatePresence } from "motion/react";
import { useConfigStore } from "../../store/useConfigStore";
import { PART_OPTIONS } from "../../data/parts";
import { useState, useMemo, useEffect, useCallback } from "react";
import { SidebarMenu } from "./SidebarMenu";
import { CircularMenu } from "./CircularMenu";
import { PageModal } from "../modals/PageModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnalysisOverlay } from "../feedback/AnalysisOverlay";
import { useTranslation } from "react-i18next";
import { SimulationOverlay } from "./SimulationOverlay";
import { AIOverlay } from "./AIOverlay";
import CurvedLoop from "../ui/CurvedLoop";
import { useMobileSwipe } from "../../hooks/useMobileSwipe";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MobileSwipeIndicator } from "./MobileSwipeIndicator";
import { playWhooshSound } from "../../utils/sound";

const MODULE_SEQUENCE = [
  { id: "subtitle1", url: "/modelleme" },
  { id: "subtitle2", url: "/simulasyon" },
  { id: "subtitle3", url: "/ileri-malzeme" },
  { id: "subtitle4", url: "/yapay-zeka" },
];

export const ConfigPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const selectedPart = useConfigStore((state) => state.selectedPart);
  const setSelectedPart = useConfigStore((state) => state.setSelectedPart);
  const activePage = useConfigStore((state) => state.activePage);
  const setActivePage = useConfigStore((state) => state.setActivePage);
  const selectedModel = useConfigStore((state) => state.selectedModel);
  const showUI = useConfigStore((state) => state.showUI);

  const handleSwipeNext = useCallback(() => {
    if (activePage !== null || isNavOpen) return;
    const currentIndex = MODULE_SEQUENCE.findIndex((m) => m.id === selectedPart);
    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % MODULE_SEQUENCE.length;
    }
    const targetModule = MODULE_SEQUENCE[nextIndex];
    if (targetModule.id === "subtitle3") {
      playWhooshSound();
    }
    setSelectedPart(targetModule.id);
    navigate(targetModule.url);
  }, [activePage, isNavOpen, selectedPart, setSelectedPart, navigate]);

  const handleSwipePrev = useCallback(() => {
    if (activePage !== null || isNavOpen) return;
    const currentIndex = MODULE_SEQUENCE.findIndex((m) => m.id === selectedPart);
    let prevIndex = MODULE_SEQUENCE.length - 1;
    if (currentIndex !== -1) {
      prevIndex = (currentIndex - 1 + MODULE_SEQUENCE.length) % MODULE_SEQUENCE.length;
    }
    const targetModule = MODULE_SEQUENCE[prevIndex];
    if (targetModule.id === "subtitle3") {
      playWhooshSound();
    }
    setSelectedPart(targetModule.id);
    navigate(targetModule.url);
  }, [activePage, isNavOpen, selectedPart, setSelectedPart, navigate]);

  useMobileSwipe({
    onSwipeLeft: handleSwipeNext,
    onSwipeRight: handleSwipePrev,
    enabled: isMobile && activePage === null && !isNavOpen,
  });

  const isAnalysisMode =
    selectedPart === "subtitle1" && searchParams.get("mode") === "analiz";

  const toggleAnalysisMode = () => {
    if (isAnalysisMode) {
      setSearchParams({});
    } else {
      setSearchParams({ mode: "analiz" });
    }
  };

  const partData = selectedPart ? PART_OPTIONS[selectedPart] : null;

  const menuItems = useMemo(() => {
    return selectedModel === "bee"
      ? [
          {
            id: "subtitle1",
            url: "/modelleme",
            label: t("menu.modeling"),
            subLabel: t("menu.modeling_sub"),
          },
          {
            id: "subtitle2",
            url: "/simulasyon",
            label: t("menu.simulation"),
            subLabel: t("menu.simulation_sub"),
          },
          {
            id: "subtitle3",
            url: "/ileri-malzeme",
            label: t("menu.advanced_materials"),
            subLabel: t("menu.advanced_materials_sub"),
          },
          {
            id: "subtitle4",
            url: "/yapay-zeka",
            label: t("menu.ai"),
            subLabel: t("menu.ai_sub"),
          },
        ]
      : [
          { id: "subtitle5", url: "/", label: "5", subLabel: "" },
          { id: "subtitle6", url: "/", label: "6", subLabel: "" },
          { id: "subtitle7", url: "/", label: "7", subLabel: "" },
          { id: "subtitle8", url: "/", label: "8", subLabel: "" },
        ];
  }, [selectedModel, t]);

  return (
    <AnimatePresence>
      {showUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-10">
          {/* Dairesel Seçim Menüsü */}
          {selectedPart !== "subtitle2" && selectedPart !== "subtitle4" && (
            <CircularMenu
              isNavOpen={isNavOpen}
              setIsNavOpen={(val) => {
                setIsNavOpen(val);
                if (!val) {
                  navigate("/");
                  setActivePage(null);
                }
              }}
              menuItems={menuItems}
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
            />
          )}

          {/* Sol Açılır Menü */}
          <SidebarMenu
            isNavOpen={isNavOpen}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          {/* Sağ Seçili Eleman Bilgi Paneli */}
          <AnimatePresence>
            {selectedPart &&
              partData &&
              selectedPart !== "subtitle2" &&
              selectedPart !== "subtitle4" && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute bottom-6 left-4 right-4 md:top-1/2 md:bottom-auto md:right-6 md:left-auto md:-translate-y-1/2 md:w-72 bg-[#050505]/30 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 pointer-events-auto z-20">
                  <h2 className="font-display text-lg md:text-xl font-semibold text-white mb-2 tracking-[0.2em] uppercase">
                    {t(partData.nameKey)}
                  </h2>
                  <p className="text-gray-400 text-sm mb-2 md:mb-4 max-h-32 md:max-h-none overflow-y-auto md:overflow-visible pr-1">
                    {t(partData.descKey)}
                  </p>

                  {/* Ozvia Butonu (subtitle4'te gösterilir) */}
                  {selectedPart === "subtitle4" && (
                    <a
                      href="https://ozviai.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 pointer-events-auto font-display font-semibold tracking-[0.18em] text-xs min-h-[44px] border-amber-400/35 text-amber-300/90 bg-amber-400/5 hover:border-amber-400/60 hover:text-amber-200 hover:bg-amber-400/8 hover:shadow-[0_0_16px_rgba(251,191,36,0.1)] text-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 opacity-75">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      {t("menu.try_ozvia")}
                    </a>
                  )}
                </motion.div>
              )}
          </AnimatePresence>

          {/* Masaüstü Modelleme ve İleri Malzeme için ANASAYFA Butonu */}
          <AnimatePresence>
            {!isMobile && (selectedPart === "subtitle1" || selectedPart === "subtitle3") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-40">
                <button
                  onClick={() => {
                    setSelectedPart(null);
                    setActivePage(null);
                    navigate("/");
                  }}
                  className="flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 font-display font-semibold tracking-widest text-xs border-white/20 text-white/80 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/40">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  {t("simulation.home_btn")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobil Görünüm için Swipe Sayfalama & Home Butonu Göstergesi */}
          <AnimatePresence>
            {isMobile && activePage === null && !isNavOpen && (
              <MobileSwipeIndicator />
            )}
          </AnimatePresence>

          {/* Simülasyon Özel Arayüzü */}
          <AnimatePresence>
            {selectedPart === "subtitle2" && (
              <SimulationOverlay
                onClose={() => {
                  setSelectedPart(null);
                  setActivePage(null);
                  navigate("/");
                }}
              />
            )}
          </AnimatePresence>

          {/* Yapay Zeka Özel Arayüzü */}
          <AnimatePresence>
            {selectedPart === "subtitle4" && (
              <AIOverlay
                onClose={() => {
                  setSelectedPart(null);
                  setActivePage(null);
                  navigate("/");
                }}
              />
            )}
          </AnimatePresence>

          {/* Logo */}
          <div className="absolute top-4 left-4 md:top-8 md:right-8 md:left-auto pointer-events-auto z-30 select-none flex flex-col items-start md:items-center">
            <div className="flex items-center gap-6">
              {/* Ozvia Logo - sadece Yapay Zeka ekranında */}
              <AnimatePresence>
                {selectedPart === "subtitle4" && (
                  <div className="flex flex-col items-center relative -mt-6 mr-6">
                    <a
                      href="https://ozviai.com/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <motion.img
                        src="/img/ozvia_logo.png"
                        alt="Ozvia Logo"
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="h-8 md:h-12 w-auto shrink-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </a>
                    <div className="w-full absolute top-full mt-2 pointer-events-none">
                      <CurvedLoop
                        marqueeText={t("model_labels.ozvia_ai_powered")}
                        speed={3}
                        curveAmount={0}
                        interactive={false}
                        className="fill-white text-[4.5rem] md:text-[8.5rem] font-display"
                      />
                    </div>
                  </div>
                )}
              </AnimatePresence>
              {/* Volinor Logo */}
              <img
                src="/img/volinor_yazı.png"
                alt="Volinor Logo"
                onClick={() => {
                  navigate("/");
                  setIsNavOpen(false);
                }}
                className="h-10 md:h-16 w-auto shrink-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
          </div>

          {/* Analiz modu yer tutucu kartı */}
          <AnalysisOverlay visible={isAnalysisMode} />

          {/* Tam Ekran Bilgi ve Form Modalı */}
          <PageModal
            activePage={activePage}
            setActivePage={setActivePage}
            setIsNavOpen={setIsNavOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
