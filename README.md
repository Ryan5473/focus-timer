# Pomodoro Task Manager

A modern, feature-rich Pomodoro timer application with an integrated Kanban task board. Built with Next.js, TypeScript, and Tailwind CSS.

![Pomodoro Task Manager](https://productivity.cleverdeveloper.in/og.png)

## Features

- **Pomodoro Timer**

  - Customizable focus and break durations
  - Visual progress indicator
  - Auto-start option for sessions
  - Mini-widget for tracking time while scrolling
  - Support for both short and long breaks

- **Kanban Board**

  - Drag-and-drop task management
  - Three status columns: Not Started, In Progress, and Done
  - Persistent storage using localStorage
  - Smooth animations and transitions
  - Quick task addition and removal

- **User Interface**
  - Dark mode by default with system theme support
  - Responsive design for all screen sizes
  - Clean, modern UI with blur effects
  - Geist font family integration
  - Framer Motion animations

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/C-W-D-Harshit/time-focus.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Root layout with theme provider
│   └── page.tsx      # Main application page
├── components/
│   ├── KanbanBoard.tsx       # Kanban board implementation
│   ├── PomodoroTimer.tsx     # Timer component
│   ├── SettingsModal.tsx     # Timer settings
│   └── PomodoroMiniWidget.tsx # Floating mini timer
├── contexts/
│   └── TimerContext.tsx      # Timer state management
└── lib/
    └── utils.ts              # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [shadcn/ui Documentation](https://ui.shadcn.com/) - learn about the UI components used.
- [Framer Motion](https://www.framer.com/motion/) - for animation capabilities.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
