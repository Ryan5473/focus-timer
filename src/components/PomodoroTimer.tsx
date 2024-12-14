"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Eye,
  Settings2,
  RotateCcw,
  Coffee,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "./SettingsModal";
import { DevTools } from "./DevTools";
import { useTimerContext } from "@/contexts/TimerContext";
import { motion, AnimatePresence } from "framer-motion";
import { PomodoroMiniWidget } from "./PomodoroMiniWidget";

type TimerMode = "focus" | "shortBreak" | "longBreak";

export default function PomodoroTimer() {
  const { settings } = useTimerContext();
  const [time, setTime] = useState(settings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [cycleCount, setCycleCount] = useState(0);
  const [timerSpeed, setTimerSpeed] = useState(1);
  const [showDevTools, setShowDevTools] = useState(false);
  const [autoStart, setAutoStart] = useState(true);
  const [showMiniWidget, setShowMiniWidget] = useState(false);

  const timerRef = useRef<HTMLDivElement>(null);

  const progress = 1 - time / (settings[`${mode}Time`] * 60);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      if (!isActive) {
        setTime(settings[`${newMode}Time`] * 60);
      }
      if (autoStart) {
        setIsActive(true);
      }
    },
    [settings, autoStart, isActive]
  );

  const nextMode = useCallback(() => {
    if (mode === "focus") {
      const breakMode =
        settings.breakType === "short" ? "shortBreak" : "longBreak";
      setMode(breakMode);
      setTime(settings[`${breakMode}Time`] * 60);
      if (breakMode === "longBreak") {
        setCycleCount(0);
      } else {
        setCycleCount((prev) => (prev + 1) % 4);
      }
    } else {
      setMode("focus");
      setTime(settings.focusTime * 60);
    }
    if (autoStart) {
      setIsActive(true);
    }
  }, [mode, settings, autoStart]);

  useEffect(() => {
    if (!isActive) {
      setTime(settings[`${mode}Time`] * 60);
    }
  }, [settings, mode, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = Math.max(prevTime - timerSpeed, 0);
          if (newTime === 0) {
            nextMode();
          }
          return newTime;
        });
      }, 1000 / timerSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, timerSpeed, nextMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMiniWidget(!entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const currentRef = timerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(settings[`${mode}Time`] * 60);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSpeedChange = (speed: number) => {
    setTimerSpeed(speed);
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (newMode !== "focus") {
      newMode = settings.breakType === "short" ? "shortBreak" : "longBreak";
    }
    switchMode(newMode);
  };

  const handleCycleChange = (cycle: number) => {
    setCycleCount(cycle);
  };

  const scrollToTimer = () => {
    timerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        className="bg-gray-800 relative bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700"
        ref={timerRef}
      >
        <div className="relative flex flex-col items-center">
          <div className="relative w-[300px] h-[300px]">
            {/* Progress circle */}
            <div className="relative w-[300px] h-[300px]">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle
                  cx="150"
                  cy="150"
                  r="145"
                  fill="none"
                  stroke="rgba(75, 85, 99, 0.3)"
                  strokeWidth="10"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="145"
                  fill="none"
                  stroke="rgba(209, 213, 219, 0.8)"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 145}
                  strokeDashoffset={2 * Math.PI * 145 * (1 - progress)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              </svg>
            </div>

            {/* Timer content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  {mode === "focus" ? (
                    <Eye className="w-5 h-5 mb-2 opacity-60" />
                  ) : (
                    <Coffee className="w-5 h-5 mb-2 opacity-60" />
                  )}
                  <div className="text-6xl font-light tracking-wider mb-1">
                    {formatTime(time)}
                  </div>
                  <div className="text-sm tracking-[0.2em] opacity-60 mb-2">
                    {mode === "focus"
                      ? "FOCUS"
                      : mode === "shortBreak"
                      ? "SHORT BREAK"
                      : "LONG BREAK"}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      i < cycleCount ? "bg-gray-200" : "bg-gray-400/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetTimer}
              className="rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 w-10 h-10 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={toggleTimer}
              className="rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 px-8 h-10"
            >
              {isActive ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isActive ? "PAUSE" : "START"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMode}
              className="rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 w-10 h-10 p-0"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 w-10 h-10 p-0"
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Auto-start toggle */}
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="autoStart"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="autoStart" className="text-gray-300 text-sm">
              Auto-start next session
            </label>
          </div>

          {/* Dev Tools Toggle */}
          <Button
            variant="link"
            onClick={() => setShowDevTools(!showDevTools)}
            className="mt-4 text-gray-400 hover:text-gray-200"
          >
            {showDevTools ? "Hide Dev Tools" : "Show Dev Tools"}
          </Button>

          {showDevTools && (
            <DevTools
              onSpeedChange={handleSpeedChange}
              onModeChange={handleModeChange}
              onCycleChange={handleCycleChange}
              breakType={settings.breakType}
            />
          )}
        </div>
        <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      </div>
      <PomodoroMiniWidget
        time={time}
        mode={mode}
        isVisible={showMiniWidget}
        onClick={scrollToTimer}
      />
    </>
  );
}
