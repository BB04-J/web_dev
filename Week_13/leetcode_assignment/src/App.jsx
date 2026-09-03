import { useState } from "react";
import {
  List,
  Star,
  LockKeyhole,
  Funnel,
  Play,
  Menu,
  RotateCcw,
} from "lucide-react";

const questions = [
  {
    id: 14,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 217,
    title: "Contains Duplicate",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 125,
    title: "Valid Palindrome",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 26,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 66,
    title: "Plus One",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 136,
    title: "Single Number",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 88,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 69,
    title: "Sqrt(x)",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 206,
    title: "Reverse Linked List",
    difficulty: "Easy",
    status: "Solved",
  },
  {
    id: 141,
    title: "Linked List Cycle",
    difficulty: "Easy",
    status: "Solved",
  },
];

function App() {
  // ==========================================
  // SIDEBAR STATE
  // ==========================================

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [filterOpen, setFilterOpen] = useState(false);

  const [difficulty, setDifficulty] = useState("Easy");

  const [status, setStatus] = useState({
    Todo: false,
    Solved: false,
    Attempted: false,
  });

  // ==========================================
  // FILTER LOGIC
  // ==========================================

  const filteredQuestions = questions.filter((question) => {
    // Difficulty filter
    if (difficulty && question.difficulty !== difficulty) {
      return false;
    }

    // Status filter
    const selectedStatuses = Object.keys(status).filter((key) => status[key]);

    if (
      selectedStatuses.length > 0 &&
      !selectedStatuses.includes(question.status)
    ) {
      return false;
    }

    return true;
  });

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setDifficulty("");
    setStatus({
      Todo: false,
      Solved: false,
      Attempted: false,
    });
  };

  // ==========================================
  // STATUS CHECKBOX HANDLER
  // ==========================================

  const handleStatusChange = (name) => {
    setStatus((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-72
          bg-[#282828]
          p-6
          transition-transform
          duration-300
          ease-in-out

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">My Lists</h2>

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-[#3a3a3a]"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Created by me */}
        <p className="mt-6 text-sm font-semibold">Created by me</p>

        {/* Favorite */}
        <div className="mt-3 flex h-12 items-center justify-between rounded-lg bg-[#3a3a3a] px-3">
          {/* Star + Favorite */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-white">
              <Star
                size={18}
                fill="#F5B642"
                strokeWidth={1.5}
                className="text-[#F5B642]"
              />
            </div>

            <span className="text-sm font-semibold">Favorite</span>
          </div>

          {/* Lock */}
          <LockKeyhole size={17} className="text-gray-300" />
        </div>
      </aside>

      {/* =====================================================
          OPEN SIDEBAR BUTTON
      ====================================================== */}

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-30 rounded-lg border border-[#444] bg-[#282828] p-3 hover:bg-[#333]"
        >
          <Menu size={20} />
        </button>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className={`
          min-h-screen
          p-4
          transition-all
          duration-300
          sm:p-6
          lg:p-8

          ${sidebarOpen ? "lg:ml-72" : "ml-0"}
        `}
      >
        <div className="flex min-h-full flex-col gap-6 lg:flex-row lg:gap-10">
          {/* =================================================
              FAVORITE CARD
          ================================================= */}

          <section className="w-full rounded-2xl bg-[#242424] p-6 sm:p-8 lg:w-[38%] lg:min-w-[300px]">
            {/* Star */}
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white sm:h-24 sm:w-24">
              <Star
                size={45}
                fill="#F5B642"
                strokeWidth={1.5}
                className="text-[#F5B642] sm:h-[54px] sm:w-[54px]"
              />
            </div>

            {/* Title */}
            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Favorite</h1>

            {/* Metadata */}
            <p className="mt-3 flex flex-wrap items-center gap-1 text-sm text-gray-300">
              Sumana · 19 questions ·
              <LockKeyhole size={14} />
              Private
            </p>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-black">
                <Play size={17} fill="black" />
                Practice
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#333333]">
                <List size={19} />
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6 border-t border-[#3a3a3a]" />

            {/* Progress */}
            <div className="mt-6">
              <h3 className="font-semibold">Progress</h3>

              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
                {/* Progress Circle */}
                <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-green-500 border-r-transparent border-b-transparent rotate-[-45deg]" />

                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      19
                      <span className="text-sm font-normal">/19</span>
                    </div>

                    <div className="mt-1 text-sm text-gray-300">✓ Solved</div>
                  </div>
                </div>

                {/* Difficulty stats */}
                <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:flex-col">
                  <div className="rounded-lg bg-[#333333] px-2 py-2 text-center sm:px-5 sm:py-3">
                    <div className="text-xs text-cyan-400 sm:text-sm">Easy</div>

                    <div className="text-sm font-semibold sm:text-base">
                      11/11
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#333333] px-2 py-2 text-center sm:px-5 sm:py-3">
                    <div className="text-xs text-yellow-400 sm:text-sm">
                      Med.
                    </div>

                    <div className="text-sm font-semibold sm:text-base">
                      7/7
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#333333] px-2 py-2 text-center sm:px-5 sm:py-3">
                    <div className="text-xs text-red-400 sm:text-sm">Hard</div>

                    <div className="text-sm font-semibold sm:text-base">
                      1/1
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-gray-400">
                0 Attempting
              </p>
            </div>
          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <section className="min-w-0 flex-1">
            {/* Filter buttons */}
            <div className="relative flex items-center gap-3">
              {/* Filter button */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-gray-200"
              >
                <Funnel size={16} />
                Filter
              </button>

              {/* Active difficulty */}
              {difficulty && (
                <div className="flex h-10 items-center gap-2 rounded-full border border-gray-600 px-4 text-sm">
                  <span>{difficulty}</span>

                  <button
                    onClick={() => setDifficulty("")}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs text-gray-300 hover:bg-gray-500"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* =================================================
                  FILTER POPUP
              ================================================= */}

              {filterOpen && (
                <div className="absolute left-0 top-12 z-30 w-72 rounded-xl border border-[#4a4a4a] bg-[#303030] p-5 shadow-2xl">
                  {/* Status */}
                  <h3 className="text-sm font-semibold">Status</h3>

                  <div className="mt-4 flex flex-wrap gap-4">
                    {["Todo", "Solved", "Attempted"].map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={status[item]}
                          onChange={() => handleStatusChange(item)}
                          className="h-4 w-4 accent-green-500"
                        />

                        {item}
                      </label>
                    ))}
                  </div>

                  {/* Difficulty */}
                  <h3 className="mt-6 text-sm font-semibold">Difficulty</h3>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-cyan-400">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={difficulty === "Easy"}
                        onChange={() => setDifficulty("Easy")}
                        className="accent-cyan-400"
                      />
                      Easy
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-yellow-400">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={difficulty === "Medium"}
                        onChange={() => setDifficulty("Medium")}
                        className="accent-yellow-400"
                      />
                      Medium
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-red-400">
                      <input
                        type="radio"
                        name="difficulty"
                        checked={difficulty === "Hard"}
                        onChange={() => setDifficulty("Hard")}
                        className="accent-red-400"
                      />
                      Hard
                    </label>
                  </div>

                  {/* Show tags */}
                  <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" />
                    Show tags
                  </label>

                  {/* Reset */}
                  <button
                    onClick={resetFilters}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3a3a3a] py-2 text-sm hover:bg-[#444]"
                  >
                    <RotateCcw size={15} />
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                QUESTIONS
            ================================================= */}

            <div className="mt-4 space-y-2">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="flex items-center justify-between rounded-lg bg-[#303030] px-3 py-3 sm:px-4"
                  >
                    {/* Left */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <span className="shrink-0 text-green-500">✓</span>

                      <span className="truncate text-sm font-medium sm:text-base">
                        {question.id}. {question.title}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <span className="ml-3 shrink-0 text-xs text-cyan-400 sm:text-sm">
                      {question.difficulty}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-[#303030] p-8 text-center text-gray-400">
                  No questions match your filters.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
