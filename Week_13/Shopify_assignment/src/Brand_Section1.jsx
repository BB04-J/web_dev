import { useEffect, useState } from "react";

// AI platform logo chips
import chatgptLogo from "../assets/logo1.svg";
import googleLogo from "../assets/logo2.png";
import copilotLogo from "../assets/logo3.svg";

// Images
import sweater from "../assets/sweater.webp";           // floating sweater with search bar baked in
import sweater2 from "../assets/sweater2.webp";         // POS / checkout device mockups

// Videos
import sweaterModelVideo from "../assets/video3.webm";  // clip used in the "result" state
import blobVideo from "../assets/blob_video.webm";      // same hero clip, replayed small in the corner

// The three states the right-side visual cycles through, matching the real site's loop
const CHAT_STATES = ["searching", "result", "checkout"];

export default function BrandChatSection() {
  const [chatStateIndex, setChatStateIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setCardVisible(false);

      // Swap state after fade completes
      setTimeout(() => {
        setChatStateIndex((prev) => (prev + 1) % CHAT_STATES.length);
        setCardVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeState = CHAT_STATES[chatStateIndex];

  return (
    <section className="bg-black px-6 lg:px-10 py-10 lg:py-16">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B3B2E] via-[#0E2A22] to-black min-h-[560px] p-8 sm:p-14">

        {/* AI platform logo chips */}
        <div className="flex -space-x-3 mb-16">
          <img src={chatgptLogo} alt="ChatGPT" className="w-11 h-11 rounded-full ring-2 ring-black bg-white p-2" />
          <img src={googleLogo} alt="Google" className="w-11 h-11 rounded-full ring-2 ring-black bg-white p-2" />
          <img src={copilotLogo} alt="Copilot" className="w-11 h-11 rounded-full ring-2 ring-black bg-white p-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: heading + copy */}
          <div className="max-w-md">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight leading-tight text-white">
              Your brand has
              <br />
              entered the chat
            </h2>
            <p className="mt-5 text-white/60 max-w-sm">
              Get discovered across AI channels. Shoppers check out right in
              the chat. You don't lift a finger. All powered by{" "}
              <a href="#" className="underline hover:text-white">
                Agentic Storefronts
              </a>
              .
            </p>
          </div>

          {/* RIGHT: cycling visual card */}
          <div className="relative lg:justify-self-end w-full max-w-[320px] h-[420px]">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-400 ${
                cardVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* STATE 1: floating sweater — search bar is already baked into the image */}
              {activeState === "searching" && (
                <img
                  src={sweater}
                  alt="AI searching for a green knit sweater"
                  className="w-full h-full object-contain"
                />
              )}

              {/* STATE 2: video of the model wearing the sweater + chat query overlay */}
              {activeState === "result" && (
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={sweaterModelVideo} type="video/webm" />
                  </video>

                  {/* chat query bubble */}
                  <div className="absolute top-4 left-4 right-4 bg-white text-black rounded-2xl px-4 py-3 text-xs shadow-lg">
                    I need a warm sweater in green. Under $200.
                  </div>

                  {/* product name/price caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium">Forest Knit Sweater</p>
                    <p className="text-xs text-white/70">$125.00</p>
                  </div>
                </div>
              )}

              {/* STATE 3: checkout / POS device mockups */}
              {activeState === "checkout" && (
                <img
                  src={sweater2}
                  alt="Checkout and order screens across devices"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* small corner video, bottom-right — same hero clip, plays continuously across all states */}
            <div className="hidden sm:flex absolute -bottom-6 -right-10 w-28 h-20 rounded-xl overflow-hidden ring-4 ring-black items-end p-1.5">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={blobVideo} type="video/webm" />
              </video>
              <span className="relative text-[10px] font-medium flex items-center gap-1 text-white">
                <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Why we build Shopify
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
