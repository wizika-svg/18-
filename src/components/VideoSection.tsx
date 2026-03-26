import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { VideoCard } from "./VideoCard";
import { Video } from "@/lib/mock-data";

interface VideoSectionProps {
  title: string;
  icon?: React.ReactNode;
  videos: Video[];
  linkTo?: string;
  columns?: 2 | 3 | 4;
}

export function VideoSection({ title, icon, videos, linkTo, columns = 4 }: VideoSectionProps) {
  if (!videos.length) return null;

  const colsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl md:text-2xl font-display font-bold text-foreground">
          {icon}
          {title}
        </h2>
        {linkTo && (
          <Link to={linkTo} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className={`grid ${colsClass} gap-4 md:gap-6`}>
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
