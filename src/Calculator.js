import { memo, useEffect, useState, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import clickSound from "./ClickSound.m4a";
import alarmSound from "./AlarmSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);

  const [duration, setDuration] = useState(0);
  const [initialDuration, setInitialDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const alarmRef = useRef(null);

  useEffect(
    function () {
      const calculatedDuration =
        (number * sets * speed) / 60 + (sets - 1) * durationBreak;
      setDuration(calculatedDuration);
      setInitialDuration(calculatedDuration);
    },
    [number, sets, speed, durationBreak]
  );

  // Synchronize sound with duration state
  useEffect(
    function () {
      const playSound = function () {
        if (!allowSound) return;
        const sound = new Audio(clickSound);
        sound.play();
      };

      playSound();
    },
    [duration, allowSound]
  );

  // Play alarm sound when duration reaches zero
  useEffect(() => {
    if (duration === 0 && isRunning) {
      alarmRef.current = new Audio(alarmSound);
      alarmRef.current.play();
      setIsAlarmPlaying(true);
      setIsRunning(false);
    }
  }, [duration, isRunning]);

  //Run the timer
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setDuration((prevDuration) => {
          if (prevDuration <= 0) {
            clearInterval(interval);
            return 0;
          }
          return Math.max(prevDuration - 1 / 60, 0);
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const mins = Math.floor(duration);
  const seconds = Math.floor((duration - mins) * 60);

  function handleInc() {
    setDuration((duration) => Math.floor(duration) + 1);
  }

  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration) - 1 : 0));
  }

  function handleStart() {
    setIsRunning(true);
  }

  function handlePause() {
    setIsPaused((prev) => !prev);
  }

  function handleStop() {
    setIsRunning(false);
    setIsPaused(false);
    setIsAlarmPlaying(false);
    setDuration(initialDuration);
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
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
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
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        {!isRunning && !isAlarmPlaying && (
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
        {!isRunning && !isAlarmPlaying && (
          <button onClick={handleStart}>
            <FaPlay />
          </button>
        )}
        {isRunning && (
          <>
            <button onClick={handlePause}>
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
            <button onClick={handleStop}>
              <FaStop />
            </button>
          </>
        )}
        {isAlarmPlaying && (
          <button onClick={handleStop}>
            <FaStop />
          </button>
        )}
      </section>
    </>
  );
}

export default memo(Calculator);
