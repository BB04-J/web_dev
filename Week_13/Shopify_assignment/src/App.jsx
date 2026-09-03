import { useEffect, useState } from "react";

import ScrollGallery from "./ScrollGallery";
import BrandChatSection1 from "./Brand_Section1";
import MoreSections from "./MoreSections";

import logo from "../assets/d9340911ca8c679b148dd4a205ad2ffa.svg";
import secondaryLogo from "../assets/d35240ac8553d40d3c6f986b3a47e8bb.png";
import backgroundVideo from "../assets/blob_video.webm";

function App() {
  const headlines = [
    "AI all-star",
    "solo-preneur",
    "category creator",
    "global empire",
    "store they line up for",
    "household name",
  ];

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Change text after fade
      setTimeout(() => {
        setHeadlineIndex((prev) => (prev + 1) % headlines.length);
        setIsVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* ================= BACKGROUND VIDEO ================= */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={backgroundVideo} type="video/webm" />
        </video>

        {/* ================= DARK OVERLAY ================= */}
        <div className="absolute inset-0 bg-black/30" />

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 min-h-screen text-white">
          {/* ================= NAVBAR ================= */}
          <nav className="flex items-center justify-between px-8 py-5 lg:px-10">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-8">
              {/* LOGO */}
              <img src={logo} alt="Shopify" className="h-10 w-auto" />

              {/* NAV LINKS */}
              <div className="hidden items-center gap-7 text-lg font-sm lg:flex">
                <button className="flex items-center gap-1">
                  Why Shopify
                  <span className="text-xs">⌄</span>
                </button>

                <button className="flex items-center gap-1">
                  Products
                  <span className="text-xs ">⌄</span>
                </button>

                <button>Pricing</button>

                <button>Enterprise</button>

                {/* SPRING EDITION */}
                <button
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/70
                  px-4
                  py-2
                  text-lg
                  font-sm
                  transition
                  hover:bg-white/10
                "
                >
                  <img src={secondaryLogo} alt="" className="h-7 w-7" />
                  Spring '26 Edition
                </button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">
              <button className="hidden text-sm font-large lg:block">
                Log in
              </button>

              <button
                className="
                rounded-full
                bg-white
                px-5
                py-2.5
                text-md
                font-semibold
                text-black
                transition
                hover:bg-gray-200
              "
              >
                Start for free
              </button>
            </div>
          </nav>

          {/* ================= HERO ================= */}
          <main className="flex min-h-[calc(100vh-90px)] items-end px-8 pb-14 lg:px-10 lg:pb-16">
            <div className="max-w-[650px]">
              {/* HEADLINE — "Be the next" is static, only the rotating word fades */}
              <h1 className="max-w-[650px] lg:max-w-[750px] text-[clamp(2.75rem,6vw,5.5rem)] font-light leading-[1.05] tracking-[-0.01em] text-white">
                Be the next
                <br />
                <span
                  className={`transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {headlines[headlineIndex]}
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p
                className="
                mt-6
                max-w-[430px]
                text-[13px]
                font-normal
                leading-[1.35]
                text-white
                sm:text-2xl
              "
              >
                Dream big and build fast on Shopify.
                <br />
                The world's best commerce platform.
              </p>

              {/* BUTTONS */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {/* START FOR FREE */}
                <button
                  className="
                  rounded-full
                  bg-white
                  px-6
                  py-3.5
                  text-md
                  font-semibold
                  text-black
                  transition
                  hover:bg-gray-200
                "
                >
                  Start for free
                </button>

                {/* WHY SHOPIFY */}
                <button
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/80
                  px-6
                  py-3.5
                  text-md
                  font-medium
                  text-white
                  transition
                  hover:bg-white/10
                "
                >
                  <span
                    className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white
                    text-[8px]
                  "
                  >
                    ▶
                  </span>
                  Why we build Shopify
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* NEW SECTION */}
      <ScrollGallery />
      <BrandChatSection1 />
      <MoreSections />  
    </div>
  );
}

export default App;
