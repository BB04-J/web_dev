import React, { useEffect, useState } from "react";

// ============ IMAGE IMPORTS ============
// Rename your actual files in src/assets to match these, or edit the paths below.

import sellChannelsGraphic from "../assets/p1.webp";   // Shopify bag + marketplace/social icons fanning out
import themeEditorScreenshot from "../assets/p12.png";          // storefront builder UI, "Draft" badge, sidebar
import checkoutSummaryCard from "../assets/p3.png";        // order summary + "Pay now" button
import shippingPackageUI from "../assets/p6.webp";       // package size picker / "Create shipping label"
import posScreens from "../assets/p2.webp";                      // dark iPad + iPhone POS mockups
import aiAgentPrompt from "../assets/p24.png";               // dark UI, floating dashboard cards, prompt bar
import appEcosystemGrid from "../assets/p26.jpg";         // huge grid of app/integration icons
import brandLogosGrid from "../assets/p27.png";             // tilted grid of brand logo cards
import founderPhoto from "../assets/p22.jpg";                 // woman with skincare bottles + paintings

import sweaterRustModel from "../assets/p17.jpg";        // red/rust turtleneck, woman
import sweaterOliveModel from "../assets/p18.jpg";      // olive crew, man
import sweaterBrownModel from "../assets/p28.jpg";      // brown turtleneck, woman
import cookwareLifestyle from "../assets/p8.png";       // blue pot + pan on stovetop
import ovenLifestyle from "../assets/p23.jpg";               // countertop oven with steak

import dottedWorldMap from "../assets/p20.png";            // teal dotted map on dark green
import orderListOverlay from "../assets/p55.webp";        // small #2050/#2049 order list card
import whyWeBuildThumbStatic from "../assets/blob_video.webm"; // STATIC image, not a video, for this section

// Localized product card data — cycles the flag + card together
const MARKETS = [
  { code: "JP", flag: "🇯🇵", price: "¥18,500", cta: "今すぐ購入" },
  { code: "MX", flag: "🇲🇽", price: "$2,450", cta: "Comprar Ahora" },
  { code: "ES", flag: "🇪🇸", price: "€125.00", cta: "Comprar Ahora" },
  { code: "US", flag: "🇺🇸", price: "$135.00", cta: "Buy Now" },
  { code: "GB", flag: "🇬🇧", price: "£108.00", cta: "Buy Now" },
];

function SellAcrossBorders() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCardVisible(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % MARKETS.length);
        setCardVisible(true);
      }, 300);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const active = MARKETS[activeIndex];

  return (
    <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B3B2E] via-[#0E2A22] to-black min-h-[500px] p-8 sm:p-14">

        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr] gap-10 items-center">

          {/* LEFT: vertically cycling flag column */}
          <div className="flex lg:flex-col gap-3 overflow-hidden h-[280px] justify-center">
            {MARKETS.map((market, i) => (
              <div
                key={market.code}
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-500 ${
                  i === activeIndex
                    ? "bg-white/90 scale-110 ring-2 ring-white"
                    : "bg-white/10 scale-90 opacity-50"
                }`}
              >
                {market.flag}
              </div>
            ))}
          </div>

          {/* CENTER: localized product card */}
          <div className="flex justify-center">
            <div
              className={`relative w-full max-w-[260px] transition-opacity duration-300 ${
                cardVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="rounded-2xl overflow-hidden bg-white shadow-2xl">
                <img
                  src={sweaterBrownModel}
                  alt="Model wearing the sweater, shown to an international shopper"
                  className="w-full h-56 object-cover"
                />
                <div className="bg-[#0E2A22] text-white text-center py-3 text-sm font-medium">
                  {active.cta}
                </div>
              </div>

              {/* floating price pill */}
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white text-black rounded-full pl-2 pr-4 py-2 shadow-lg flex items-center gap-2 text-xs font-medium whitespace-nowrap">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
                  {active.code}
                </span>
                Order for {active.price}
              </div>
            </div>
          </div>

          {/* RIGHT: dotted map + shipping/order overlays */}
          <div className="relative hidden lg:block h-[280px]">
            <img
              src={dottedWorldMap}
              alt="Dotted world map"
              className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-2xl"
            />
            <img
              src={shippingPackageUI}
              alt="Shipping package size picker"
              className="absolute top-0 left-4 w-40 h-auto object-contain drop-shadow-xl"
            />
            <img
              src={orderListOverlay}
              alt="List of recent orders with fulfilled checkmarks"
              className="absolute bottom-0 right-4 w-32 h-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* BOTTOM: heading + copy */}
        <div className="mt-12 max-w-md">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-3">
            Sell across borders
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Shopify takes the complexity out of international selling, from
            delivering products faster and more affordably to localising
            your experience with{" "}
            <a href="#" className="underline hover:text-white">
              Shopify Markets
            </a>
            .
          </p>
        </div>

        {/* STATIC thumbnail, bottom-right — plain image, no video here */}
        <div className="hidden sm:flex absolute bottom-8 right-8 w-28 h-20 rounded-xl overflow-hidden ring-4 ring-black/40 items-end p-1.5">
          <img
            src={whyWeBuildThumbStatic}
            alt="Why we build Shopify thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="relative text-[10px] font-medium flex items-center gap-1 text-white">
            <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Why we build Shopify
          </span>
        </div>
      </div>
    </section>
  );
}

export default function MoreSections() {
  return (
    <div className="bg-black text-white">

      {/* ================= SELL ACROSS EVERY CHANNEL ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              One product, listed
              <br />
              everywhere shoppers are
            </h2>
            <p className="mt-5 text-white/60 max-w-md">
              Publish once and reach shoppers on Amazon, eBay, TikTok,
              Instagram, Pinterest, Google, and YouTube — all synced back to
              a single Shopify dashboard.
            </p>
          </div>
          {/* Constrained to max-w-xs so the graphic reads at its natural card scale */}
          <div className="flex justify-center">
            <img
              src={sellChannelsGraphic}
              alt="Shopify connecting a product to Amazon, eBay, TikTok, Instagram, Pinterest, Google and YouTube"
              className="w-full max-w-xs h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= THEME EDITOR / STOREFRONT BUILDER ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
            Design a store that's built to sell
          </h2>
          <p className="mt-5 text-white/60">
            Drag-and-drop sections, live preview, and AI-assisted copy —
            build a storefront that looks custom without writing code.
          </p>
        </div>

        {/* Constrained + object-contain so nothing overflows or crops mid-scroll */}
        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d]">
          <img
            src={themeEditorScreenshot}
            alt="Shopify theme editor showing a draft homepage with an image banner and section sidebar"
            className="w-full h-auto max-h-[600px] object-contain mx-auto"
          />
        </div>
      </section>

      {/* ================= CHECKOUT + SHIPPING ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight max-w-2xl mb-10">
          Checkout and fulfillment, handled
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
          {/* Checkout card — capped to its natural card width */}
          <div className="rounded-2xl bg-white p-6 w-full max-w-sm mx-auto md:mx-0">
            <img
              src={checkoutSummaryCard}
              alt="Checkout order summary with total and Pay now button"
              className="w-full h-auto object-contain rounded-xl"
            />
            <p className="mt-4 text-black/60 text-sm px-1">
              The world's best-converting checkout, powered by Shop Pay.
            </p>
          </div>

          {/* Shipping card */}
          <div className="rounded-2xl bg-white p-6 w-full max-w-sm mx-auto md:mx-0">
            <img
              src={shippingPackageUI}
              alt="Shipping package size picker with a suggested box and create shipping label button"
              className="w-full h-auto object-contain rounded-xl"
            />
            <p className="mt-4 text-black/60 text-sm px-1">
              Compare rates and print labels for every carrier, in one place.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SELL IN PERSON (POS) ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <img
              src={posScreens}
              alt="Shopify POS running on an iPad and iPhone showing a new order screen"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              Sell face to face, too
            </h2>
            <p className="mt-5 text-white/60 max-w-md">
              Shopify POS keeps in-store and online inventory in sync, so
              every sale — wherever it happens — updates the same dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= AI AGENT FEATURE ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0b3b] via-[#120a2e] to-black p-8 sm:p-14">
          <div className="max-w-xl mb-10">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              Your own AI store manager
            </h2>
            <p className="mt-5 text-white/60">
              Ask it to build a collection, analyze sales, or restock a
              bestseller — it works across your whole store.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <img
              src={aiAgentPrompt}
              alt="AI prompt bar asking to create a collection of best selling products, with floating sales and product cards"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ================= APP ECOSYSTEM ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight max-w-2xl mb-4">
          Endless ways to grow
        </h2>
        <p className="text-white/60 max-w-md mb-10">
          Thousands of apps in the Shopify App Store — for marketing,
          shipping, accounting, loyalty, and everything in between.
        </p>

        <div className="rounded-2xl overflow-hidden max-h-[420px]">
          <img
            src={appEcosystemGrid}
            alt="Grid of app and integration icons available in the Shopify App Store"
            className="w-full h-auto max-h-[420px] object-cover"
          />
        </div>
      </section>

      {/* ================= TRUSTED BY LEADING BRANDS ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight text-center max-w-2xl mx-auto mb-10">
          For anyone from entrepreneurs to enterprise
        </h2>

        <div className="rounded-2xl overflow-hidden max-h-[420px]">
          <img
            src={brandLogosGrid}
            alt="Tilted grid of brand logos including Vuori, Leesa, Tecovas, Brooklinen, Allbirds, Alo, Gymshark, Monos, Muji, Dr Squatch and Poppi"
            className="w-full h-auto max-h-[420px] object-cover"
          />
        </div>
      </section>

      {/* ================= PRODUCT / LIFESTYLE SHOWCASE ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight max-w-2xl mb-10">
          Built for every kind of brand
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-2xl overflow-hidden aspect-[3/4]">
            <img src={sweaterRustModel} alt="Model wearing a rust turtleneck sweater" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4]">
            <img src={sweaterOliveModel} alt="Model wearing an olive crewneck sweater" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4] col-span-2 md:col-span-1">
            <img src={sweaterBrownModel} alt="Model wearing a brown turtleneck sweater" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4]">
            <img src={cookwareLifestyle} alt="Blue enameled cookware on a stovetop" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4]">
            <img src={ovenLifestyle} alt="Countertop oven cooking a tray of steak" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ================= FOUNDER TESTIMONIAL ================= */}
      <section className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden max-w-md mx-auto lg:mx-0">
            <img
              src={founderPhoto}
              alt="A founder sitting in front of colorful paintings next to her skincare product line"
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-light leading-snug">
              "Shopify gave us everything we needed to go from a kitchen
              table idea to a brand people recognize."
            </p>
            <p className="mt-6 text-white/60">Founder, Grows the Earth</p>
          </div>
        </div>
      </section>

      {/* ================= SELL ACROSS BORDERS (flags + localized card + map) ================= */}
      <SellAcrossBorders />

    </div>
  );
}
