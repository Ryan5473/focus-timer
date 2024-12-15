"use client";

import PomodoroTimer from "@/components/PomodoroTimer";
import KanbanBoard from "@/components/KanbanBoard";
import { TimerProvider } from "@/contexts/TimerContext";
import { SpotifyWidget } from "@/components/SpotifyWidget";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <TimerProvider>
      <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <main className="flex-grow p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-medium text-gray-100 text-center">
              Pomodoro Task Manager
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PomodoroTimer />
              <SpotifyWidget />
              <div className="lg:col-span-2">
                <KanbanBoard />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </TimerProvider>
  );
}
