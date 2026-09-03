import { useEffect, useRef, useState } from "react";

// ============ IMAGE IMPORTS ============
// Replace these with your actual filenames from src/assets
import img1 from "../assets/10.webp";
import img2 from "../assets/06.jpg";
import img3 from "../assets/13.webp";
import img4 from "../assets/05.webp";
import img5 from "../assets/03.webp";
import img6 from "../assets/07.webp";
import img7 from "../assets/08.webp";
import img8 from "../assets/09.webp";
import img9 from "../assets/02.webp";
import img10 from "../assets/11.webp";
import img11 from "../assets/12.webp";
import img12 from "../assets/04.webp";
import img13 from "../assets/14.webp";

const GALLERY_IMAGES = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

// Headline is split into 4 phrase segments — each one highlights in turn as the user scrolls
const PHRASES = [
  "Sell everywhere people shop.",
  "Online and in person.",
  "Across AI and on social.",
  "Locally and globally.",
];

export default function ScrollGallery() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 -> 1 across the whole pinned section

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      // How far we've scrolled through this section, clamped between 0 and 1
      const raw = -rect.top / scrollableDistance;
      const clamped = Math.min(Math.max(raw, 0), 1);

      setProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Which phrase is "active" right now, based on scroll progress
  const activeIndex = Math.min(
    PHRASES.length - 1,
    Math.floor(progress * PHRASES.length)
  );

  // Move the image strip horizontally as the user scrolls vertically
  const maxTranslate = GALLERY_IMAGES.length * 340; // 340px per card incl. gap — tune to your image width
  const translateX = progress * maxTranslate;

  return (
    // Tall wrapper gives us room to scroll through — increase h-[400vh] for a slower/longer effect
    <section ref={sectionRef} className="relative h-[400vh] bg-black">
      {/* Sticky inner content stays pinned in the viewport while the section scrolls past */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* ================= HEADLINE ================= */}
        <div className="px-8 lg:px-10 max-w-6xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-snug">
            {PHRASES.map((phrase, i) => (
              <span
                key={i}
                className={`transition-colors duration-500 ${
                  i === activeIndex
                    ? "text-white"
                    : i < activeIndex
                    ? "text-white/30"
                    : "text-white/30"
                }`}
              >
                {phrase}{" "}
              </span>
            ))}
          </h2>
        </div>

        {/* ================= HORIZONTAL IMAGE STRIP ================= */}
        <div className="mt-14 overflow-hidden">
          <div
            className="flex gap-5 px-8 lg:px-10 will-change-transform"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                className="shrink-0 w-[320px] h-[420px] rounded-2xl overflow-hidden bg-gray-900"
              >
                <img
                  src={src}
                  alt={`Shopify merchant example ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
