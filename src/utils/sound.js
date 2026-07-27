/**
 * sound.js
 * İleri Malzeme seçildiğinde çalışan MP3 ses efekti modülü.
 * public/sounds/whoosh.mp3 dosyasını çalar.
 */

let lastPlayTime = 0;

export const playWhooshSound = () => {
  try {
    const nowMs = Date.now();
    if (nowMs - lastPlayTime < 300) return;
    lastPlayTime = nowMs;

    const audio = new Audio("/sounds/whoosh.mp3");
    audio.volume = 0.8;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Whoosh MP3 ses efekti oynatılamadı:", err);
      });
    }
  } catch (err) {
    console.error("Whoosh ses efekti hatası:", err);
  }
};
