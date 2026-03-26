import { motion } from "framer-motion";
import { Play, TrendingUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, formatViewCount } from "@/lib/mock-data";

interface HeroSectionProps {
  video: Video;
}

export function HeroSection({ video }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/15 to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto h-full flex items-end pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl space-y-5"
        >
          <div className="flex items-center gap-3">
            {video.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                ★ Featured
              </span>
            )}
            {video.trending && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-trending/90 text-xs font-semibold text-background">
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
            <span className="text-sm text-muted-foreground">{video.category}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
            {video.title}
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            {video.description}
          </p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {formatViewCount(video.view_count)} views
            </span>
            <span>•</span>
            <span>{video.duration}</span>
            <span>•</span>
            <span>{video.category}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link to={`/watch/${video.id}`}>
              <Button variant="premium" size="lg" className="gap-2 text-base px-8">
                <Play className="w-5 h-5" fill="currentColor" /> Watch Now
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="glass" size="lg" className="text-base">
                Browse All
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
    </section>
  );
}
