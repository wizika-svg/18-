import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, formatViewCount } from "@/lib/mock-data";

interface WatchNextOverlayProps {
  videos: Video[];
  show: boolean;
  onDismiss: () => void;
}

export function WatchNextOverlay({ videos, show, onDismiss }: WatchNextOverlayProps) {
  const [countdown, setCountdown] = useState(10);
  const nextVideo = videos[0];

  useEffect(() => {
    if (!show || !nextVideo) return;
    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show, nextVideo]);

  if (!nextVideo) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center max-w-md space-y-6">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Up Next</p>

            {/* Countdown circle */}
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray={`${(countdown / 10) * 100.5} 100.5`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-display font-bold text-foreground">
                {countdown}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-foreground">{nextVideo.title}</h3>
              <p className="text-sm text-muted-foreground">{formatViewCount(nextVideo.view_count)} views • {nextVideo.duration}</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link to={`/watch/${nextVideo.id}`}>
                <Button variant="premium" size="lg" className="gap-2">
                  <Play className="w-5 h-5" fill="currentColor" /> Play Now
                </Button>
              </Link>
              <Button variant="glass" onClick={onDismiss}>Cancel</Button>
            </div>

            {/* More recommendations */}
            {videos.length > 1 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Also recommended</p>
                <div className="flex gap-3 justify-center">
                  {videos.slice(1, 4).map(v => (
                    <Link key={v.id} to={`/watch/${v.id}`} className="group w-28">
                      <div className="aspect-video rounded-lg bg-secondary overflow-hidden group-hover:ring-2 ring-primary/50 transition-all">
                        {v.thumbnail_url?.trim() ? (
                          <img
                            src={v.thumbnail_url}
                            alt={v.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-900/20" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1 group-hover:text-foreground transition-colors">{v.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
