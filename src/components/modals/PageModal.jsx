import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VideoLibrary from "../../pages/VideoLibrary";
import ProductsSlider from "./ProductsSlider";
import DealershipSlider from "./DealershipSlider";
import ReferencesBox from "./ReferencesBox";
import AboutBox from "./AboutBox";

const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const PdfPreview = ({ url }) => {
  const [loaded, setLoaded] = useState(false);
  const fullUrl = getMediaUrl(url);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 z-10 pointer-events-none">
          <svg className="w-8 h-8 text-white/20 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <iframe
        src={`${fullUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title="pdf-preview"
        onLoad={() => setLoaded(true)}
        className="w-full h-full border-0 pointer-events-none"
      />
    </div>
  );
};

export const PageModal = ({ activePage, setActivePage, setIsNavOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (activePage === "sertifika-ve-patentler") {
      const cached = localStorage.getItem("volinor_certificates");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) {
            setCertificates(parsed);
            return;
          }
        } catch (e) {}
      }

      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/certificates/`,
      )
        .then((r) => r.json())
        .then((data) => {
          setCertificates(data);
          localStorage.setItem("volinor_certificates", JSON.stringify(data));
        })
        .catch(() => {});
    }
  }, [activePage]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/send-email/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        },
      );

      if (!response.ok) throw new Error("send_failed");

      setSubmitStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSubmitStatus((s) => ({ ...s, success: false }));
      }, 5000);
    } catch {
      setSubmitStatus({
        loading: false,
        success: false,
        error: t("contact.error"),
      });
    }
  };

  const handleClose = () => {
    if (activePage === "siyah") {
      navigate("/");
      setActivePage(null);
      if (setIsNavOpen) setIsNavOpen(false);
    } else {
      navigate("/siyah");
      setActivePage("siyah");
    }
  };

  const isWidePage =
    activePage === "urunlerimiz" ||
    activePage === "referanslar" ||
    activePage === "video-kutuphanesi" ||
    activePage === "sertifika-ve-patentler" ||
    activePage === "iletisim" ||
    activePage === "hakkimizda" ||
    activePage === "bayiliklerimiz" ||
    activePage === "siyah";

  return (
    <AnimatePresence>
      {activePage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-y-0 left-0 md:left-[300px] right-0 z-[45] md:z-30 pointer-events-auto flex items-start md:items-center justify-center p-6 pt-24 md:p-16 border-l border-[#ffb800]/10 ${activePage === "hakkimizda" ? "overflow-y-auto md:overflow-hidden bg-[#0a0a0a] custom-scrollbar" : "overflow-y-auto custom-scrollbar bg-[#0a0a0a]"}`}>
          {/* CLOSE (X) BUTTON */}
          <button
            onClick={handleClose}
            aria-label={t("ui.close", "Kapat")}
            className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2.5 rounded-full bg-black/40 text-white/70 hover:text-[#ffb800] hover:bg-black/70 backdrop-blur-md transition-all duration-300 group min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", damping: 25 }}
            className={`w-full pointer-events-auto text-left mx-auto md:my-auto ${activePage === "hakkimizda" ? "md:h-full md:flex md:flex-col md:justify-center" : ""} ${isWidePage ? "max-w-7xl" : "max-w-3xl"}`}>
            <button
              onClick={handleClose}
              className="md:hidden font-display text-[#ffb800]/80 hover:text-[#ffb800] text-xs tracking-[0.25em] font-semibold mb-6 flex items-center gap-2 min-h-[44px]">
              <span className="text-lg">←</span> {t("ui.back_to_menu")}
            </button>

            {activePage !== "hakkimizda" && activePage !== "siyah" && (
              <h1
                className={`font-display font-light text-white whitespace-pre-line ${
                  activePage === "urunlerimiz" ||
                  activePage === "sertifika-ve-patentler"
                    ? "text-2xl md:text-4xl tracking-[0.25em] md:tracking-[0.3em]"
                    : "text-3xl md:text-5xl tracking-[0.25em] md:tracking-[0.35em]"
                } ${
                  activePage === "iletisim" ||
                  activePage === "model-kutuphanesi" ||
                  activePage === "urunlerimiz" ||
                  activePage === "bayiliklerimiz" ||
                  activePage === "referanslar"
                    ? "sr-only"
                    : "mb-4 md:mb-6"
                }`}>
                {t(`pages.${activePage}`, activePage)}
              </h1>
            )}

            {activePage === "video-kutuphanesi" && (
              <p className="text-white/70 text-sm md:text-base font-light max-w-3xl leading-relaxed mb-6">
                {t("pages.video_kutuphanesi_desc")}
              </p>
            )}

            <div className="text-white/60 text-base md:text-lg font-light leading-relaxed">
              {activePage === "siyah" && (
                <div className="w-full h-[65vh] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 select-none">
                  <img
                    src="/img/volinor_kucuk.png"
                    alt="Volinor Logo Icon"
                    className="h-24 md:h-36 w-auto object-contain drop-shadow-[0_0_35px_rgba(255,184,0,0.35)]"
                  />
                  <img
                    src="/img/volinor_yazı.png"
                    alt="Volinor Logo Text"
                    className="h-16 md:h-28 w-auto object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]"
                  />
                </div>
              )}
              {activePage === "hakkimizda" && (
                <div className="w-full mt-4 md:mt-6">
                  <AboutBox />
                </div>
              )}
              {activePage === "urunlerimiz" && (
                <div className="w-full mt-4 md:mt-6">
                  <ProductsSlider />
                </div>
              )}
              {activePage === "iletisim" && (
                <div className="flex flex-col gap-8 md:gap-10 text-left">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-4 tracking-[0.2em]">
                      {t("contact.heading")}
                    </h3>
                    <p className="leading-relaxed text-sm md:text-base">
                      info@volinor.com
                      <br />
                      0533 654 7937
                      <br />
                      Mustafa Kemal Mah. Dumlupınar Bul. No:280 G İç Kapı
                      No:1260, Çankaya / Ankara
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-stretch gap-8 md:gap-12">
                    <div className="flex-1">
                      <form
                        className="flex flex-col gap-4"
                        onSubmit={handleEmailSubmit}>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder={t("contact.name_placeholder")}
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm min-h-[44px]"
                          disabled={submitStatus.loading}
                        />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder={t("contact.email_placeholder")}
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm min-h-[44px]"
                          disabled={submitStatus.loading}
                        />
                        <textarea
                          placeholder={t("contact.message_placeholder")}
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          rows="4"
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none text-sm min-h-[100px]"
                          disabled={submitStatus.loading}></textarea>

                        {submitStatus.success && (
                          <div className="text-green-400 text-xs tracking-wider">
                            {t("contact.success")}
                          </div>
                        )}
                        {submitStatus.error && (
                          <div className="text-red-400 text-xs tracking-wider">
                            {submitStatus.error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={submitStatus.loading}
                          className={`font-display bg-white text-black text-sm tracking-[0.25em] font-semibold py-3 rounded-lg transition-colors mt-2 min-h-[44px] ${submitStatus.loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white/80"}`}>
                          {submitStatus.loading
                            ? t("contact.sending")
                            : t("contact.send")}
                        </button>
                      </form>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1 flex flex-col">
                      <div className="h-full min-h-[300px] rounded-xl overflow-hidden border border-white/10 relative">
                        <iframe
                          title="Volinor Konum"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.889!2d32.7487!3d39.9025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f190a9cea8f%3A0xd3862ea8bc96f59!2sMustafa%20Kemal%2C%20Dumlup%C4%B1nar%20Blv.%20No%3A280%2C%2006510%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1718700000000!5m2!1str!2str"
                          className="absolute inset-0 w-full h-full"
                          style={{
                            border: 0,
                            filter:
                              "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)",
                          }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activePage === "sertifika-ve-patentler" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mt-8">
                  {certificates.map((cert, index) => (
                      <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative w-full aspect-[0.65] max-w-[280px] mx-auto group cursor-pointer"
                      onClick={() =>
                        window.open(
                          cert.verification_link || cert.document,
                          "_blank",
                        )
                      }>
                      <div className="absolute inset-0 p-4 pb-12 bg-transparent flex items-center justify-center z-0">
                        {cert.document?.toLowerCase().endsWith(".pdf") ? (
                          <PdfPreview url={cert.document} />
                        ) : (
                          <img
                            src={getMediaUrl(cert.document)}
                            alt={cert.name}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>

                      <div className="absolute bottom-[4%] left-0 right-0 flex items-center justify-center gap-1.5 px-4 text-[#ffb800] group-hover:text-white transition-colors duration-300 z-20 pointer-events-none">
                        <span className="text-white text-[10px] sm:text-xs tracking-[0.1em] font-semibold uppercase truncate">
                          {cert.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {activePage === "referanslar" && (
                <div className="w-full mt-4 md:mt-6">
                  <ReferencesBox />
                </div>
              )}
              {activePage === "bayiliklerimiz" && (
                <div className="w-full mt-4 md:mt-6">
                  <DealershipSlider />
                </div>
              )}
              {activePage === "model-kutuphanesi" && (
                <div className="flex flex-col items-start gap-6 mt-4">
                  <div className="mb-2">
                    <h1 className="text-3xl md:text-5xl font-display font-light tracking-[0.25em] md:tracking-[0.3em] uppercase drop-shadow-md">
                      <span className="text-white">MODEL </span><span className="text-[#ffb800]">KÜTÜPHANESİ</span>
                    </h1>
                    <p className="text-white/40 text-[10px] md:text-xs tracking-[0.35em] mt-2 font-medium">
                      3D MODELLER VE SİMÜLASYONLAR
                    </p>
                  </div>
                  
                  <p className="text-white/70 text-sm md:text-base font-light max-w-2xl leading-relaxed">
                    {t("pages.model_kutuphanesi_desc", "Geniş 3D model kütüphanemizi keşfedin, detaylı incelemeler ve simülasyonlar için kütüphanemize göz atın.")}
                  </p>

                  <button 
                    onClick={() => navigate("/model-kutuphanesi")}
                    className="group mt-4 relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#ffb800]/10 border border-[#ffb800]/30 hover:bg-[#ffb800]/20 hover:border-[#ffb800]/60 transition-all duration-300 rounded-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffb800]/0 via-[#ffb800]/10 to-[#ffb800]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative font-display font-semibold tracking-[0.2em] text-[#ffb800] text-sm">
                      KÜTÜPHANEYE GİT
                    </span>
                    <svg 
                      className="relative w-5 h-5 text-[#ffb800] group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              )}
              {activePage === "video-kutuphanesi" && (
                <div className="mt-8">
                  <VideoLibrary />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
