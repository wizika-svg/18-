import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Upload, Film, Tags, Settings, BarChart3, TrendingUp,
  Eye, Clock, Plus, Search, Edit, Trash2, Star, ChevronLeft, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockVideos, formatViewCount, categories } from "@/lib/mock-data";

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Film, label: "Videos", path: "/admin/videos" },
  { icon: Upload, label: "Upload", path: "/admin/upload" },
  { icon: Tags, label: "Categories", path: "/admin/categories" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminPage() {
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const currentPath = location.pathname;

  const totalViews = mockVideos.reduce((sum, v) => sum + v.view_count, 0);
  const trendingCount = mockVideos.filter(v => v.trending).length;
  const featuredCount = mockVideos.filter(v => v.featured).length;

  const stats = [
    { icon: Film, label: "Total Videos", value: mockVideos.length.toString(), color: "text-primary" },
    { icon: Eye, label: "Total Views", value: formatViewCount(totalViews), color: "text-badge-new" },
    { icon: TrendingUp, label: "Trending", value: trendingCount.toString(), color: "text-trending" },
    { icon: Star, label: "Featured", value: featuredCount.toString(), color: "text-popular" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span className="font-display font-bold text-lg text-foreground">Vault<span className="text-primary">TV</span></span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPath === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <ChevronLeft className="w-4 h-4" /> Back to Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-strong flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <span className="font-display font-bold text-foreground">Admin</span>
        </div>
        <Link to="/"><Button variant="ghost" size="sm">Site</Button></Link>
      </div>

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileNav(false)}>
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="w-64 h-full bg-card border-r border-border p-4 space-y-1"
            onClick={e => e.stopPropagation()}
          >
            {adminNav.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileNav(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:pl-0 pt-14 lg:pt-0 overflow-auto">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your content and analytics</p>
            </div>
            <Link to="/admin/upload">
              <Button variant="premium" className="gap-2">
                <Plus className="w-4 h-4" /> Upload Video
              </Button>
            </Link>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent videos table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-foreground">All Videos</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Search videos..." className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50" />
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Video</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Category</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Views</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Status</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockVideos.map(video => (
                      <tr key={video.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-9 rounded-md bg-gradient-to-br from-primary/20 to-purple-900/20 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{video.title}</p>
                              <p className="text-xs text-muted-foreground">{video.duration}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-muted-foreground">{video.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground">{formatViewCount(video.view_count)}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex gap-1.5">
                            {video.trending && <span className="px-2 py-0.5 rounded-full bg-trending/15 text-trending text-xs font-medium">Trending</span>}
                            {video.featured && <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">Featured</span>}
                            {!video.trending && !video.featured && <span className="text-xs text-muted-foreground">Active</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top performing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-card border border-border space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Most Viewed</h3>
              {[...mockVideos].sort((a, b) => b.view_count - a.view_count).slice(0, 5).map((v, i) => (
                <div key={v.id} className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-display font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{formatViewCount(v.view_count)} views</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-xl bg-card border border-border space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Uploads</h3>
              {[...mockVideos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5).map(v => (
                <div key={v.id} className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
