import React from "react";
import ReactDOM from "react-dom/client";
import { ArrowRight, Globe, Instagram, Twitter } from "lucide-react";
import heroImage from "./assets/hero-fallback.png";
import "./styles.css";

// Background media toggle.
// Set USE_VIDEO to `true` once the hero video is ready — the app will render
// the <video> below. While it's `false`, the static image is shown instead.
const USE_VIDEO = false;

const videoSource =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

function App() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const fadingOutRef = React.useRef(false);
  const opacityRef = React.useRef(0);

  const cancelFade = React.useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const fadeTo = React.useCallback(
    (targetOpacity: number, duration = 500) => {
      const video = videoRef.current;
      if (!video) return;

      cancelFade();

      const startOpacity = opacityRef.current;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const nextOpacity = startOpacity + (targetOpacity - startOpacity) * progress;

        opacityRef.current = nextOpacity;
        video.style.opacity = String(nextOpacity);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        opacityRef.current = targetOpacity;
        video.style.opacity = String(targetOpacity);
        animationFrameRef.current = null;
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [cancelFade],
  );

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      fadingOutRef.current = false;
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;

      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const handleEnded = () => {
      cancelFade();
      opacityRef.current = 0;
      video.style.opacity = "0";

      window.setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        void video.play();
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleLoaded();
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      cancelFade();
    };
  }, [cancelFade, fadeTo]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      {USE_VIDEO ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full translate-y-[17%] object-cover opacity-0"
          src={videoSource}
          muted
          autoPlay
          playsInline
          preload="auto"
        />
      ) : (
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
        />
      )}

      <div className="relative z-20 px-6 py-6">
        <nav className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold text-white" aria-label="Home">
            <Globe size={24} aria-hidden="true" />
            <span>Gabriela</span>
          </a>

          <div className="flex items-center gap-8">
            {["Projects", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <section className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
        <h1
          className="mb-8 whitespace-nowrap text-5xl tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          I design things. Then I build them.
        </h1>

        <div className="w-full max-w-xl space-y-4">
          <form className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
            />
            <button type="submit" className="rounded-full bg-white p-3 text-black" aria-label="Submit email">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </form>

          <p className="px-4 text-sm leading-relaxed text-white">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on
            exciting updates.
          </p>

          <div className="flex justify-center">
            <a
              href="#"
              className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Download CV
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <a
          href="#"
          className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
          aria-label="Instagram"
        >
          <Instagram size={20} aria-hidden="true" />
        </a>
        <a
          href="#"
          className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
          aria-label="Twitter"
        >
          <Twitter size={20} aria-hidden="true" />
        </a>
        <a
          href="#"
          className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
          aria-label="Website"
        >
          <Globe size={20} aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
