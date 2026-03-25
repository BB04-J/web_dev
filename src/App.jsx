import { quizData } from "./data";
import { useState } from "react";

function App() {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizData[currentIndex];
  const options = ["a", "b", "c", "d"];

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true); 
    }
  };

  const calculateScore = () => {
    let score = 0;

    quizData.forEach((q, index) => {
      if (answers[index] === q.correct) {
        score++;
      }
    });

    return score;
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div>
        <h1>Quiz Completed 🎉</h1>
        <h2>
          Your Score: {calculateScore()} / {quizData.length}
        </h2>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="quiz-box"></div>
      <h1>Quiz</h1>

      <div className="card">

      <h3>
        Question {currentIndex + 1} / {quizData.length}
      </h3>

      <h2>{currentQuestion.question}</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {options.map((option) => (
          <li key={option}>
            <label>
              <input
                type="radio"
                name="answer"
                value={option}
                onChange={() => {
                  setAnswers({
                    ...answers,
                    [currentIndex]: option
                  });
                }}
                checked={answers[currentIndex] === option}
              />
              {currentQuestion[option]}
            </label>
          </li>
        ))}
      </ul>
      </div>

      <button onClick={handleNext}>
        {currentIndex === quizData.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
}

export default App;