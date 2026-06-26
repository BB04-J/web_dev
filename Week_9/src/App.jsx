import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
 
const FIELD_ORDER = ["hours", "minutes", "seconds"];
const DEFAULT_SECONDS = 5 * 60; // starting demo time: 5 minutes
 

function formatTime(time) {
  const safeTime = Math.max(0, Math.floor(time) || 0);
  const hours = Math.floor(safeTime / 3600);
  const minutes = Math.floor((safeTime % 3600) / 60);
  const seconds = Math.floor(safeTime % 60);
  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}
 
function calculateTime(hours, minutes, seconds) {
  const calculatedTime =
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10);
 
  return Number.isNaN(calculatedTime) ? 0 : calculatedTime;
}
 

function useCountdown(initialSeconds) {
  const [time, setTime] = useState(initialSeconds);
  const [initialTime, setInitialTime] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
 
  useEffect(() => {
    if (!isRunning) return; // nothing to do while paused
 
    const intervalId = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setIsRunning(false); // auto-pause when we hit 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
 
    return () => clearInterval(intervalId);
  }, [isRunning]);
 
  return {
    time,
    setTime,
    initialTime,
    setInitialTime,
    isRunning,
    setIsRunning,
  };
}
 

function TimeUnit({ field, label, displayValue, editState, inputRefs, onEdit, onChange, onKeyDown }) {
  const isEditing = editState.field === field;
 
  return (
    <div className="unit">
      {isEditing ? (
        <input
          ref={(el) => {
            inputRefs.current[field] = el;
          }}
          className="unit-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          autoFocus
          value={editState.value}
          aria-label={`Edit ${label}`}
          onChange={(e) => onChange(field, e.target.value)}
          onKeyDown={(e) => onKeyDown(field, e)}
         
          onBlur={() => onEdit(field)}
        />
      ) : (
        <button
          type="button"
          className="unit-value"
          onClick={() => onEdit(field)}
          aria-label={`Edit ${label}, current value ${displayValue}`}
        >
          {displayValue}
        </button>
      )}
      <span className="unit-label">{label}</span>
    </div>
  );
}
 

export default function App() {
  const {
    time,
    setTime,
    initialTime,
    setInitialTime,
    isRunning,
    setIsRunning,
  } = useCountdown(DEFAULT_SECONDS);
 
  
  const [editState, setEditState] = useState({ field: null, value: "" });
  const inputRefs = useRef({});
 
  const displayed = formatTime(time);
 

  const saveField = useCallback(
    (field, rawValue) => {
      const newTime = {
        ...formatTime(time),
        [field]: (rawValue || "0").padStart(2, "0"),
      };
      const calculatedTime = calculateTime(
        newTime.hours,
        newTime.minutes,
        newTime.seconds
      );
      setTime(calculatedTime);
      setInitialTime(calculatedTime); 
    },
    [time, setTime, setInitialTime]
  );
 
  const handleEditField = (field) => {
    if (editState.field === field) {
      saveField(field, editState.value);
      setEditState({ field: null, value: "" });
    } else {
      setIsRunning(false); // pause while editing
      const current = formatTime(time);
      const stripped = String(parseInt(current[field], 10)); 
      setEditState({ field, value: stripped === "NaN" ? "" : stripped });
    }
  };
 
  
  const handleInputChange = (field, rawInput) => {
    const digits = rawInput.replace(/\D/g, "").slice(0, 2);
    setEditState({ field, value: digits });
 
    if (digits.length === 2) {
      saveField(field, digits);
 
      const nextField = FIELD_ORDER[FIELD_ORDER.indexOf(field) + 1];
      if (nextField) {
        const current = formatTime(time); 
        const nextStripped = String(parseInt(current[nextField], 10));
        setEditState({
          field: nextField,
          value: nextStripped === "NaN" ? "" : nextStripped,
        });
       
        requestAnimationFrame(() => {
          const el = inputRefs.current[nextField];
          if (el) {
            el.focus();
            el.select();
          }
        });
      } else {
        setEditState({ field: null, value: "" }); 
      }
    }
  };
 
  const handleKeyDown = (field, e) => {
    if (e.key === "Enter") handleEditField(field);
    if (e.key === "Escape") setEditState({ field: null, value: "" });
  };
 
  const handleReset = () => {
    setIsRunning(false);
    setEditState({ field: null, value: "" });
    setTime(initialTime);
  };
 
  const toggleRunning = () => {
    if (time === 0 || editState.field) return;
    setIsRunning((prev) => !prev);
  };
 
 
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = initialTime > 0 ? (initialTime - time) / initialTime : 0;
  const dashOffset = circumference * (1 - progress);
 
  const status =
    time === 0 ? "Done" : editState.field ? "Editing" : isRunning ? "Running" : "Paused";
 
  return (
    <div className="timer-app">
      <div className="card">
        <div className="status">
          <span className={`status-dot ${status.toLowerCase()}`} />
          {status}
        </div>
 
        <div className="ring-wrap">
          <svg viewBox="0 0 220 220">
            <circle
              className="ring-track"
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              strokeWidth="14"
            />
            <circle
              className="ring-progress"
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
 
          <div className="time-overlay">
            <TimeUnit
              field="hours"
              label="hrs"
              displayValue={displayed.hours}
              editState={editState}
              inputRefs={inputRefs}
              onEdit={handleEditField}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <span className="colon">:</span>
            <TimeUnit
              field="minutes"
              label="min"
              displayValue={displayed.minutes}
              editState={editState}
              inputRefs={inputRefs}
              onEdit={handleEditField}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <span className="colon">:</span>
            <TimeUnit
              field="seconds"
              label="sec"
              displayValue={displayed.seconds}
              editState={editState}
              inputRefs={inputRefs}
              onEdit={handleEditField}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
 
        <div className="controls">
          <button
            type="button"
            className={`btn btn-primary ${isRunning ? "is-running" : ""}`}
            onClick={toggleRunning}
            disabled={time === 0 || !!editState.field}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            Reset
          </button>
        </div>
 
        <p className="hint">Click hours, minutes, or seconds to edit</p>
      </div>
    </div>
  );
}