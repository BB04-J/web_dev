# React + Vite Countdown Timer

An interactive, responsive circular countdown timer built with **React 19**, **Vite 8**, and **Vanilla CSS**. This app provides a fluid and intuitive time selection interface combined with clear state indication.

## 🌟 Features

- **Circular Progress Ring**: A clean SVG-based progress circle that visually represents the elapsed and remaining time.
- **Editable Time Units**: Click directly on the Hours, Minutes, or Seconds numbers to modify them on the fly.
- **Smooth Input Switching**: Automatically focuses and shifts to the next input field as you type values for hours, minutes, and seconds.
- **Dynamic State Status**: A badge indicating the current state of the timer:
  - `Running` (Green): Timer is counting down.
  - `Paused` (Amber): Timer has been paused.
  - `Editing` (Blue): User is currently inputting new duration values.
  - `Done` (Red): Countdown has completed.
- **Keyboard Shortcuts**:
  - `Enter` to save edits and confirm time.
  - `Escape` to cancel editing and revert to the previous value.
- **Oxlint Integration**: Out-of-the-box configuration with Oxlint for fast, modern code linting.

---

## 🛠️ Tech Stack & Structure

- **Core**: React 19, Javascript (ES Modules), HTML5 (Semantic elements).
- **Styling**: Vanilla CSS with modern tokens and active state animations.
- **Linting**: Oxlint.
- **Bundler**: Vite 8.

### File Structure Details

- [`src/App.jsx`](file:///c:/Users/Bhakti/Desktop/New%20folder/cohort-week1/web_dev/Week_9/src/App.jsx): Main application logic, including the circular countdown math, the `useCountdown` hook, and the `TimeUnit` input sub-component.
- [`src/App.css`](file:///c:/Users/Bhakti/Desktop/New%20folder/cohort-week1/web_dev/Week_9/src/App.css): Layout styles for cards, status badges, buttons, and animations.
- [`src/index.css`](file:///c:/Users/Bhakti/Desktop/New%20folder/cohort-week1/web_dev/Week_9/src/index.css): Global variables and reset styles.

---

## 🚀 Running Locally

Follow these steps to run the application on your computer.

### 1. Install Dependencies
Run the command below in the project root:
```bash
npm install
```

### 2. Start the Development Server
Launch Vite's hot-reloading dev server:
```bash
npm run dev
```

### 3. Build for Production
Bundle the application with optimization for deployment:
```bash
npm run build
```

### 4. Run Linter
Execute fast oxlint verification on your codebase:
```bash
npm run lint
```

