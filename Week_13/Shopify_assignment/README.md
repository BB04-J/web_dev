# Shopify Landing Page Assignment

A modern, high-performance Shopify Landing Page clone built with **React 19**, **Vite**, and **Tailwind CSS**.

## 🚀 Features

- **Dynamic Animated Headlines**: Smooth headline transition carousel.
- **Background Video & Media**: Embedded high-definition background video effects.
- **Interactive Brand Sections**: Clean, responsive layout with custom brand showcases (`Brand_Section1`, `MoreSections`).
- **Scroll Gallery**: Interactive image/content scroll showcase (`ScrollGallery`).
- **Fully Responsive**: Optimized for modern browser viewports across mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons & Assets**: Custom SVG & WebM assets

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd Shopify_assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## 📦 Scripts

- `npm run dev`: Starts the local Vite development server with HMR.
- `npm run build`: Builds the app for production in the `dist/` directory.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint code style and syntax checks.

## 📂 Project Structure

```
Shopify_assignment/
├── assets/          # Shared asset files
├── public/          # Static public assets
├── src/
│   ├── assets/      # Media & image assets
│   ├── App.jsx      # Main application component & hero section
│   ├── Brand_Section1.jsx
│   ├── MoreSections.jsx
│   ├── ScrollGallery.jsx
│   ├── index.css    # Global styles & Tailwind imports
│   └── main.jsx     # App entry point
├── .gitignore       # Git ignore rules
├── index.html       # HTML root template
├── package.json     # Node dependencies and scripts
├── README.md        # Project documentation
└── vite.config.js   # Vite configuration
```

