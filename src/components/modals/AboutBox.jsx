import { useTranslation } from "react-i18next";

export const AboutBox = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full min-h-[550px] bg-transparent flex flex-col p-6 md:p-12 select-none border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/img/product_background.png')" }}
        />
      </div>

      {/* CORNER DECORATIONS (Desktop Only) */}
      <div className="hidden md:block absolute top-6 left-6 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
      <div className="hidden md:block absolute bottom-6 right-6 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />

      {/* MAIN CONTENT AREA */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
        {/* LEFT COLUMN: Title & Paragraphs */}
        <div className="flex flex-col text-left">
          <h1 className="font-display text-3xl md:text-5xl font-light tracking-[0.2em] md:tracking-[0.25em] text-white uppercase mb-4">
            {t("pages.hakkimizda", "HAKKIMIZDA")}
          </h1>
          <div className="h-[3px] w-12 bg-[#ffb800] mb-6"></div>

          <p className="text-sm md:text-base text-white/70 leading-relaxed font-light mb-6">
            {t("about.p1")}
          </p>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
            {t("about.p2")}
          </p>
        </div>

        {/* RIGHT COLUMN: 5 Items with dividers */}
        <div className="flex flex-col w-full text-left">
          {[
            <svg
              key="1"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffb800"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
            </svg>,
            <svg
              key="2"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffb800"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>,
            <svg
              key="3"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffb800"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <rect x="9" y="3" width="6" height="5" rx="1" />
              <rect x="3" y="16" width="6" height="5" rx="1" />
              <rect x="15" y="16" width="6" height="5" rx="1" />
              <path d="M12 8v4" />
              <path d="M6 16v-4h12v4" />
            </svg>,
            <svg
              key="4"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffb800"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <polygon points="10 8 15 10 10 12 10 8" />
            </svg>,
            <svg
              key="5"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffb800"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>,
          ].map((icon, idx) => {
            const num = idx + 1;
            const isLast = idx === 4;
            return (
              <div
                key={num}
                className={`flex items-center gap-5 py-4 ${
                  !isLast ? "border-b border-white/10" : ""
                }`}>
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                  {t(`about.li${num}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutBox;
