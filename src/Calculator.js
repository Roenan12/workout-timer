import { memo, useEffect, useReducer, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import clickSound from "./ClickSound.m4a";
import alarmSound from "./AlarmSound.m4a";

const initialState = {
  number: 0,
  sets: 3,
  speed: 90,
  durationBreak: 5,
  duration: 0,
  initialDuration: 0,
  isRunning: false,
  isPaused: false,
  isAlarmPlaying: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setNumber":
      return { ...state, number: action.payload };
    case "setSets":
      return { ...state, sets: action.payload };
    case "setSpeed":
      return { ...state, speed: action.payload };
    case "setDurationBreak":
      return { ...state, durationBreak: action.payload };
    case "setDuration":
      return { ...state, duration: action.payload };
    case "setInitialDuration":
      return { ...state, initialDuration: action.payload };
    case "startTimer":
      return { ...state, isRunning: true };
    case "pauseTimer":
      return { ...state, isPaused: !state.isPaused };
    case "stopTimer":
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        isAlarmPlaying: false,
        duration: state.initialDuration,
      };
    case "playAlarm":
      return { ...state, isAlarmPlaying: true, isRunning: false };
    default:
      throw new Error("Action Unknown");
  }
}

function Calculator({ workouts, allowSound }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    number: workouts.at(0).numExercises,
  });
  const alarmRef = useRef(null);

  useEffect(() => {
    const calculatedDuration =
      (state.number * state.sets * state.speed) / 60 +
      (state.sets - 1) * state.durationBreak;
    dispatch({ type: "setDuration", payload: calculatedDuration });
    dispatch({ type: "setInitialDuration", payload: calculatedDuration });
  }, [state.number, state.sets, state.speed, state.durationBreak]);

  // Synchronize sound with duration state
  useEffect(() => {
    const playSound = function () {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    };

    playSound();
  }, [state.duration, allowSound]);

  // Play alarm sound when duration reaches zero
  useEffect(() => {
    if (state.duration === 0 && state.isRunning) {
      alarmRef.current = new Audio(alarmSound);
      alarmRef.current.play();
      dispatch({ type: "playAlarm" });
    }
  }, [state.duration, state.isRunning]);

  useEffect(() => {
    let interval;
    if (state.isRunning && !state.isPaused) {
      interval = setInterval(() => {
        dispatch({
          type: "setDuration",
          payload: Math.max(state.duration - 1 / 60, 0),
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, state.duration]);

  const mins = Math.floor(state.duration);
  const seconds = Math.floor((state.duration - mins) * 60);

  function handleInc() {
    dispatch({ type: "setDuration", payload: Math.floor(state.duration) + 1 });
  }

  function handleDec() {
    dispatch({
      type: "setDuration",
      payload: state.duration > 1 ? Math.ceil(state.duration) - 1 : 0,
    });
  }

  function handleStart() {
    dispatch({ type: "startTimer" });
  }

  function handlePause() {
    dispatch({ type: "pauseTimer" });
  }

  function handleStop() {
    dispatch({ type: "stopTimer" });
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select
            value={state.number}
            onChange={(e) =>
              dispatch({ type: "setNumber", payload: +e.target.value })
            }
          >
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={state.sets}
            onChange={(e) =>
              dispatch({ type: "setSets", payload: e.target.value })
            }
          />
          <span>{state.sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={state.speed}
            onChange={(e) =>
              dispatch({ type: "setSpeed", payload: e.target.value })
            }
          />
          <span>{state.speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={state.durationBreak}
            onChange={(e) =>
              dispatch({ type: "setDurationBreak", payload: e.target.value })
            }
          />
          <span>{state.durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        {!state.isRunning && !state.isAlarmPlaying && (
          <>
            <button onClick={handleDec}>–</button>
            <button onClick={handleInc}>+</button>
          </>
        )}
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        {!state.isRunning && !state.isAlarmPlaying && (
          <button onClick={handleStart}>
            <FaPlay />
          </button>
        )}
        {state.isRunning && (
          <>
            <button onClick={handlePause}>
              {state.isPaused ? <FaPlay /> : <FaPause />}
            </button>
            <button onClick={handleStop}>
              <FaStop />
            </button>
          </>
        )}
        {state.isAlarmPlaying && (
          <button onClick={handleStop}>
            <FaStop />
          </button>
        )}
      </section>
    </>
  );
}

export default memo(Calculator);
