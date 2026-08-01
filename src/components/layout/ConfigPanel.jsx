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
  { id: null, url: "/" },
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
              selectedPart !== "subtitle4" && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute bottom-28 left-4 right-4 md:bottom-auto md:top-1/2 md:right-6 md:left-auto md:-translate-y-1/2 md:w-72 bg-[#050505]/30 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6 pointer-events-auto z-20">
                  <h2 className="font-display text-base md:text-xl font-semibold text-white mb-1 md:mb-2 tracking-[0.2em] uppercase">
                    {t(partData.nameKey)}
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-2 md:line-clamp-none md:max-h-none overflow-y-hidden md:overflow-visible pr-1">
                    {t(partData.descKey)}
                  </p>

                  {/* Simülasyon Ekstra Kartı (Çalışma Alanlarımız) */}
                  {selectedPart === "subtitle2" && (
                    <div className="hidden md:block mt-4 pt-4 border-t border-white/10">
                      <h2 className="font-display text-xs font-semibold text-white mb-4 tracking-[0.1em] uppercase text-center opacity-90">
                        {t("simulation.work_areas")}
                      </h2>
                      <div className="flex justify-between px-1">
                        {/* Hava */}
                        <div className="flex flex-col items-center gap-3">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5l-8.2-1.8c-1.5-.3-2.8.2-3.8 1.4-.4.4-.3 1 .1 1.4L6 14l-2.5 4.5c-.2.4-.1.9.2 1.2.3.3.8.4 1.2.2L9.5 17l3.5 3.5c.4.4 1 .5 1.4.1 1.2-1 1.7-2.3 1.4-3.8z" />
                          </svg>
                          <span className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">{t("simulation.air")}</span>
                        </div>
                        {/* Kara */}
                        <div className="flex flex-col items-center gap-3">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                            <path d="M3 11h18v4H3z" />
                            <circle cx="7" cy="16" r="2" />
                            <circle cx="17" cy="16" r="2" />
                          </svg>
                          <span className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">{t("simulation.land")}</span>
                        </div>
                        {/* Deniz */}
                        <div className="flex flex-col items-center gap-3">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="3" />
                            <line x1="12" y1="8" x2="12" y2="22" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <path d="M5 12v3a7 7 0 0 0 14 0v-3" />
                          </svg>
                          <span className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">{t("simulation.sea")}</span>
                        </div>
                        {/* Uzay */}
                        <div className="flex flex-col items-center gap-3">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                          </svg>
                          <span className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">{t("simulation.space")}</span>
                        </div>
                      </div>
                    </div>
                  )}

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
                className="h-12 md:h-20 w-auto shrink-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer hover:opacity-80 transition-opacity"
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
