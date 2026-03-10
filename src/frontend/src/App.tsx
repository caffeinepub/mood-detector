import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RefreshCw, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useRandomMood } from "./hooks/useQueries";

const queryClient = new QueryClient();

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

const MOOD_COLORS: Record<
  string,
  { glow: string; bg: string; emoji_bg: string }
> = {
  happy: {
    glow: "glow-primary",
    bg: "from-primary/10 to-primary/5",
    emoji_bg: "bg-primary/15",
  },
  joyful: {
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
  calm: {
    glow: "",
    bg: "from-teal-500/10 to-teal-500/5",
    emoji_bg: "bg-teal-500/15",
  },
  default: {
    glow: "glow-primary",
    bg: "from-primary/8 to-card",
    emoji_bg: "bg-primary/12",
  },
};

function getMoodStyle(name: string) {
  const key = name.toLowerCase();
  return MOOD_COLORS[key] ?? MOOD_COLORS.default;
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
      {/* gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.bg} pointer-events-none`}
      />

      <div className="relative flex flex-col items-center gap-5 text-center">
        {/* emoji */}
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

        {/* mood name */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight"
        >
          {name}
        </motion.h2>

        {/* description */}
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

function MoodApp() {
  const [fetchKey, setFetchKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const { data: mood, isLoading, isError } = useRandomMood(hasStarted);

  const handleDiscover = useCallback(() => {
    setFetchKey((k) => k + 1);
    setHasStarted(true);
    queryClient.resetQueries({ queryKey: ["randomMood"] });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* ambient sparkles */}
      {SPARKLE_POSITIONS.map((s) => (
        <SparkleOrb key={s.id} {...s} />
      ))}

      {/* header */}
      <header className="py-6 px-6 flex items-center justify-center border-b border-border/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-display text-lg font-semibold tracking-wide text-foreground/80">
            MoodSense
          </span>
        </div>
      </header>

      {/* main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 gap-12">
        {/* hero text */}
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
            Let the universe peek inside and reveal your current vibe.
          </p>
        </motion.div>

        {/* discover button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="relative"
        >
          {/* pulse rings when not loading */}
          {!isLoading && (
            <>
              <span
                className="absolute inset-0 rounded-full bg-primary/30 animate-ping"
                style={{ animationDuration: "2.2s" }}
              />
              <span className="absolute inset-[-8px] rounded-full border border-primary/20" />
            </>
          )}

          <Button
            data-ocid="mood.primary_button"
            onClick={handleDiscover}
            disabled={isLoading}
            size="lg"
            className="relative z-10 h-16 px-10 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-lg hover:shadow-primary/30 hover:shadow-2xl disabled:opacity-70 disabled:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="inline-block"
                >
                  ✨
                </motion.span>
                Reading your vibe…
              </span>
            ) : hasStarted ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Find Out How I Feel
              </span>
            )}
          </Button>
        </motion.div>

        {/* result area */}
        <div className="w-full max-w-md" style={{ minHeight: 320 }}>
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                data-ocid="mood.loading_state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 pt-8"
              >
                <motion.div
                  className="text-6xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  🔮
                </motion.div>
                <p className="text-muted-foreground font-body text-sm tracking-wider uppercase">
                  Sensing your energy…
                </p>
              </motion.div>
            )}

            {isError && !isLoading && (
              <motion.div
                key="error"
                data-ocid="mood.error_state"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-destructive/40 bg-destructive/10 p-8 text-center"
              >
                <p className="text-4xl mb-3">😵</p>
                <p className="text-foreground font-semibold">
                  Something went wrong!
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  The vibes got scrambled. Try again?
                </p>
              </motion.div>
            )}

            {mood && !isLoading && (
              <MoodCard
                key={fetchKey}
                name={mood.name}
                emoji={mood.emoji}
                description={mood.description}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* footer */}
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
