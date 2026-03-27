import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Clock, Calendar, Heart, Bookmark, Share2, ThumbsUp, ChevronLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { VideoCard } from "@/components/VideoCard";
import { WatchNextOverlay } from "@/components/WatchNextOverlay";
import { Video, formatViewCount, getRelatedVideos, getPopularVideos } from "@/lib/mock-data";
import { fetchVideos } from "@/lib/videos-service";

export default function WatchPage() {
  const { id } = useParams();
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideos,
  });

  const video = videos.find(v => v.id === id);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showWatchNext, setShowWatchNext] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-xl text-muted-foreground">Loading video...</p>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-xl text-muted-foreground">Video not found</p>
          <Link to="/"><Button variant="premium">Go Home</Button></Link>
        </div>
      </Layout>
    );
  }

  const related = getRelatedVideos(video, videos);
  const popular = getPopularVideos(videos).filter(v => v.id !== video.id).slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
          {/* Main column */}
          <div className="space-y-6">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border shadow-cinematic"
            >
              {video.thumbnail_url?.trim() && (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-900/10 to-background flex items-center justify-center">
                <Button
                  variant="premium"
                  size="lg"
                  className="gap-2 text-lg"
                  onClick={() => setShowWatchNext(true)}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Play Video
                </Button>
              </div>
              <WatchNextOverlay videos={related} show={showWatchNext} onDismiss={() => setShowWatchNext(false)} />
            </motion.div>

            {/* Video Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{video.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Eye className="w-4 h-4 text-primary" />
                  {formatViewCount(video.view_count)} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {video.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {new Date(video.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-secondary text-xs font-medium text-secondary-foreground">
                  {video.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 py-2">
                <Button
                  variant={liked ? "premium" : "glass"}
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className="gap-1.5"
                >
                  <ThumbsUp className="w-4 h-4" /> {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  variant={saved ? "premium" : "glass"}
                  size="sm"
                  onClick={() => setSaved(!saved)}
                  className="gap-1.5"
                >
                  <Bookmark className="w-4 h-4" /> {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="glass" size="sm" className="gap-1.5">
                  <Heart className="w-4 h-4" /> Favorite
                </Button>
                <Button variant="glass" size="sm" className="gap-1.5">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-3">
                <p className="text-sm text-foreground/90 leading-relaxed">{video.description}</p>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-border/50"
                    >
                      <Tag className="w-3 h-3" /> {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Up Next - below player on mobile */}
            <div className="xl:hidden space-y-4">
              <h3 className="text-lg font-display font-semibold text-foreground">Up Next</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {related.slice(0, 6).map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} size="small" />
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-display font-semibold text-foreground">Recommended</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {popular.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - desktop */}
          <aside className="hidden xl:block space-y-6">
            <div className="sticky top-20 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Up Next</h3>
                {related.slice(0, 6).map((v, i) => (
                  <SidebarVideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Most Popular</h3>
                {popular.slice(0, 3).map((v, i) => (
                  <SidebarVideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function SidebarVideoCard({ video, index }: { video: Video; index: number }) {
  const hasThumbnail = Boolean(video.thumbnail_url?.trim());

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/watch/${video.id}`} className="group flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
        <div className="w-36 shrink-0 aspect-video rounded-lg overflow-hidden bg-card border border-border/30 group-hover:border-primary/30 transition-colors">
          {hasThumbnail ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-900/20" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h4>
          <p className="text-xs text-muted-foreground">{formatViewCount(video.view_count)} views</p>
          <p className="text-xs text-muted-foreground">{video.duration}</p>
        </div>
      </Link>
    </motion.div>
  );
}
