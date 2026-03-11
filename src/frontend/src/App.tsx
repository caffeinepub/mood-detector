import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Clock, RefreshCw, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const queryClient = new QueryClient();

// ─── Sparkles ───────────────────────────────────────────────────────────────

function SparkleOrb({
  delay = 0,
  x = 0,
  y = 0,
  size = 6,
}: { delay?: number; x?: number; y?: number; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary pointer-events-none"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

const SPARKLE_POSITIONS = [
  { id: "s1", x: 12, y: 18, delay: 0, size: 5 },
  { id: "s2", x: 85, y: 22, delay: 0.6, size: 7 },
  { id: "s3", x: 8, y: 72, delay: 1.1, size: 4 },
  { id: "s4", x: 90, y: 68, delay: 0.3, size: 6 },
  { id: "s5", x: 45, y: 8, delay: 0.8, size: 5 },
  { id: "s6", x: 55, y: 92, delay: 1.4, size: 4 },
  { id: "s7", x: 75, y: 85, delay: 0.5, size: 8 },
  { id: "s8", x: 22, y: 88, delay: 1.7, size: 5 },
];

// ─── Mood colours & card ─────────────────────────────────────────────────────

const MOOD_COLORS: Record<
  string,
  { glow: string; bg: string; emoji_bg: string }
> = {
  happy: {
    glow: "glow-primary",
    bg: "from-primary/10 to-primary/5",
    emoji_bg: "bg-primary/15",
  },
  excited: {
    glow: "glow-primary",
    bg: "from-primary/12 to-primary/6",
    emoji_bg: "bg-primary/18",
  },
  sad: {
    glow: "",
    bg: "from-blue-500/10 to-blue-500/5",
    emoji_bg: "bg-blue-500/15",
  },
  anxious: {
    glow: "",
    bg: "from-purple-500/10 to-purple-500/5",
    emoji_bg: "bg-purple-500/15",
  },
  angry: {
    glow: "glow-accent",
    bg: "from-accent/10 to-accent/5",
    emoji_bg: "bg-accent/15",
  },
  mad: {
    glow: "glow-accent",
    bg: "from-red-500/10 to-red-500/5",
    emoji_bg: "bg-red-500/15",
  },
  "you're the one": {
    glow: "glow-primary",
    bg: "from-pink-500/15 to-rose-500/8",
    emoji_bg: "bg-pink-500/20",
  },
  calm: {
    glow: "",
    bg: "from-teal-500/10 to-teal-500/5",
    emoji_bg: "bg-teal-500/15",
  },
  sleepy: {
    glow: "",
    bg: "from-indigo-500/10 to-indigo-500/5",
    emoji_bg: "bg-indigo-500/15",
  },
  confused: {
    glow: "",
    bg: "from-orange-500/10 to-orange-500/5",
    emoji_bg: "bg-orange-500/15",
  },
  groggy: {
    glow: "",
    bg: "from-indigo-500/10 to-indigo-500/5",
    emoji_bg: "bg-indigo-500/15",
  },
  focused: {
    glow: "glow-primary",
    bg: "from-primary/10 to-primary/5",
    emoji_bg: "bg-primary/15",
  },
  relaxed: {
    glow: "",
    bg: "from-teal-500/10 to-teal-500/5",
    emoji_bg: "bg-teal-500/15",
  },
  energized: {
    glow: "glow-primary",
    bg: "from-yellow-500/10 to-yellow-500/5",
    emoji_bg: "bg-yellow-500/15",
  },
  determined: {
    glow: "glow-primary",
    bg: "from-primary/12 to-primary/6",
    emoji_bg: "bg-primary/18",
  },
  content: {
    glow: "",
    bg: "from-sky-500/10 to-sky-500/5",
    emoji_bg: "bg-sky-500/15",
  },
  "winding down": {
    glow: "",
    bg: "from-orange-500/10 to-orange-500/5",
    emoji_bg: "bg-orange-500/15",
  },
  mellow: {
    glow: "",
    bg: "from-violet-500/10 to-violet-500/5",
    emoji_bg: "bg-violet-500/15",
  },
  tired: {
    glow: "",
    bg: "from-slate-500/10 to-slate-500/5",
    emoji_bg: "bg-slate-500/15",
  },
  motivated: {
    glow: "glow-primary",
    bg: "from-primary/12 to-primary/6",
    emoji_bg: "bg-primary/18",
  },
  default: {
    glow: "glow-primary",
    bg: "from-primary/8 to-card",
    emoji_bg: "bg-primary/12",
  },
};

function getMoodStyle(name: string) {
  return MOOD_COLORS[name.toLowerCase()] ?? MOOD_COLORS.default;
}

function MoodCard({
  name,
  emoji,
  description,
}: { name: string; emoji: string; description: string }) {
  const style = getMoodStyle(name);
  return (
    <motion.div
      key={name + emoji}
      data-ocid="mood.card"
      initial={{ opacity: 0, y: 48, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -32, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`relative overflow-hidden rounded-3xl border border-border/60 card-shimmer p-8 md:p-10 max-w-md w-full mx-auto ${style.glow}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.bg} pointer-events-none`}
      />
      <div className="relative flex flex-col items-center gap-5 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 18,
            delay: 0.15,
          }}
          className={`w-28 h-28 rounded-full ${style.emoji_bg} flex items-center justify-center text-6xl select-none`}
        >
          {emoji}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight"
        >
          {name}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xs"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Time-based mood detection ───────────────────────────────────────────────

interface MoodResult {
  name: string;
  emoji: string;
  description: string;
}

const MAD_MOOD: MoodResult = {
  name: "Mad",
  emoji: "😡",
  description: "Feeling hot-headed right now.",
};

const YOU_ARE_THE_ONE_MOOD: MoodResult = {
  name: "You're the One",
  emoji: "🫵",
  description: "Out of everyone — it's you.",
};

function detectMood(): MoodResult {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const isWeekend = day === 0 || day === 6;
  const isMonday = day === 1;
  const isFriday = day === 5;

  // Late night: 11pm–5am
  if (hour >= 23 || hour < 5) {
    return {
      name: "Tired",
      emoji: "😪",
      description: "Burning the midnight oil.",
    };
  }

  // Early morning: 5–8am
  if (hour >= 5 && hour < 8) {
    return {
      name: "Groggy",
      emoji: "😴",
      description: "Still warming up to the day...",
    };
  }

  // Morning: 8am–12pm
  if (hour >= 8 && hour < 12) {
    if (isMonday)
      return {
        name: "Motivated",
        emoji: "☕",
        description: "New week, new possibilities.",
      };
    if (isWeekend)
      return {
        name: "Relaxed",
        emoji: "😌",
        description: "A slow, peaceful morning.",
      };
    return {
      name: "Focused",
      emoji: "🎯",
      description: "In the zone and getting things done.",
    };
  }

  // Midday: 12–2pm
  if (hour >= 12 && hour < 14) {
    return {
      name: "Energized",
      emoji: "⚡",
      description: "Peak performance hours!",
    };
  }

  // Afternoon: 2–5pm
  if (hour >= 14 && hour < 17) {
    if (isWeekend)
      return {
        name: "Content",
        emoji: "🌤",
        description: "Enjoying the weekend vibes.",
      };
    return {
      name: "Determined",
      emoji: "💪",
      description: "Pushing through the afternoon grind.",
    };
  }

  // Evening: 5–8pm
  if (hour >= 17 && hour < 20) {
    if (isFriday)
      return {
        name: "Excited",
        emoji: "🎉",
        description: "It's the weekend, baby!",
      };
    return {
      name: "Winding Down",
      emoji: "🌅",
      description: "The day is wrapping up nicely.",
    };
  }

  // Night: 8–11pm
  return {
    name: "Mellow",
    emoji: "🌙",
    description: "Settling into the evening.",
  };
}

// ─── Detector component ──────────────────────────────────────────────────────

type DetectorState = "idle" | "result";

function MoodDetector() {
  const [phase, setPhase] = useState<DetectorState>("idle");
  const [mood, setMood] = useState<MoodResult | null>(null);
  // Persists across resets — tracks total detect presses
  const clickCount = useRef(0);

  function handleDetect() {
    clickCount.current += 1;
    let result: MoodResult;
    if (clickCount.current % 2 === 0) {
      result = MAD_MOOD;
    } else if (Math.random() < 0.15) {
      // ~15% chance on odd presses
      result = YOU_ARE_THE_ONE_MOOD;
    } else {
      result = detectMood();
    }
    setMood(result);
    setPhase("result");
  }

  function handleReset() {
    setPhase("idle");
    setMood(null);
    // counter intentionally NOT reset
  }

  const variants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  };

  return (
    <div className="w-full max-w-lg mx-auto" style={{ minHeight: 360 }}>
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-muted-foreground text-center text-base md:text-lg leading-relaxed max-w-sm">
              We'll read the moment you're in — no questions asked.
            </p>
            <div className="relative">
              <span
                className="absolute inset-0 rounded-full bg-primary/30 animate-ping"
                style={{ animationDuration: "2.2s" }}
              />
              <span className="absolute inset-[-8px] rounded-full border border-primary/20" />
              <Button
                data-ocid="mood.primary_button"
                onClick={handleDetect}
                size="lg"
                className="relative z-10 h-16 px-10 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-lg hover:shadow-primary/30 hover:shadow-2xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Detect My Mood
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "result" && mood && (
          <motion.div
            key="result"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex flex-col items-center gap-6"
          >
            <MoodCard
              name={mood.name}
              emoji={mood.emoji}
              description={mood.description}
            />
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="flex items-center gap-1.5 text-muted-foreground text-sm"
            >
              <Clock className="w-3.5 h-3.5" />
              Based on the current time &amp; day
            </motion.p>
            <Button
              data-ocid="mood.secondary_button"
              onClick={handleReset}
              variant="outline"
              className="rounded-full px-8 h-12 text-base border-border/60 hover:border-primary/60 hover:bg-primary/10 hover:text-primary transition-all duration-150"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Detect Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── App shell ───────────────────────────────────────────────────────────────

function MoodApp() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {SPARKLE_POSITIONS.map((s) => (
        <SparkleOrb key={s.id} {...s} />
      ))}

      <header className="py-6 px-6 flex items-center justify-center border-b border-border/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-display text-lg font-semibold tracking-wide text-foreground/80">
            MoodSense
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-none">
            <span className="text-foreground">How are</span>{" "}
            <br className="hidden md:block" />
            <span className="text-primary text-glow">you feeling?</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-sm mx-auto leading-relaxed">
            Your mood, detected from the moment you're in.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg px-2"
        >
          <MoodDetector />
        </motion.div>
      </main>

      <footer className="py-5 text-center border-t border-border/30">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-accent">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MoodApp />
    </QueryClientProvider>
  );
}
