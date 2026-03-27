import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { categories, getVideosByCategory, getPopularVideos, getTrendingVideos, getRecentVideos } from "@/lib/mock-data";
import { fetchVideos } from "@/lib/videos-service";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "popular";

  const [query, setQuery] = useState(queryParam);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState(sortParam);

  const { data: videos = [] } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideos,
  });

  const filteredVideos = useMemo(() => {
    let vids = getVideosByCategory(videos, category);

    if (query.trim()) {
      const q = query.toLowerCase();
      vids = vids.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some(t => t.toLowerCase().includes(q)) ||
        v.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "popular": return getPopularVideos(vids);
      case "trending": return getTrendingVideos(vids).length ? getTrendingVideos(vids) : getPopularVideos(vids);
      case "newest": return getRecentVideos(vids);
      default: return vids;
    }
  }, [videos, query, category, sort]);

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "trending", label: "Trending" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Search header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Discover Content
          </h1>

          {/* Search input */}
          <div className="relative max-w-xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search videos, tags, categories..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50 transition-colors text-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1.5">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sort === opt.value
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <SearchIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">No videos found</p>
            <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
