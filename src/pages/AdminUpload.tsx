import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload as UploadIcon, Film, Image, ChevronLeft, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";

export default function AdminUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display font-semibold text-foreground">Upload Video</h1>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Video upload area */}
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Film className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Drop your video file here</p>
                <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV up to 2GB</p>
              </div>
              <Button variant="glass" size="sm" type="button">Browse Files</Button>
            </div>
          </div>

          {/* Thumbnail upload */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center gap-3">
              <Image className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <p className="text-sm font-medium text-foreground">Upload Thumbnail</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP — 16:9 recommended</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter video title..."
              className="w-full h-11 px-4 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your video..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50 text-sm resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-secondary text-foreground outline-none border border-border focus:border-primary/50 text-sm appearance-none"
            >
              <option value="">Select a category</option>
              {categories.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                className="flex-1 h-10 px-3 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50 text-sm"
              />
              <Button variant="glass" type="button" onClick={addTag} size="icon" className="h-10 w-10">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
              <span className="text-sm text-foreground">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={trending} onChange={e => setTrending(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
              <span className="text-sm text-foreground">Trending</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button variant="premium" className="gap-2 flex-1" type="submit">
              {uploaded ? <><Check className="w-4 h-4" /> Uploaded!</> : <><UploadIcon className="w-4 h-4" /> Upload Video</>}
            </Button>
            <Link to="/admin">
              <Button variant="glass" type="button">Cancel</Button>
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
