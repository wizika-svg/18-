import { mockVideos, Video } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";

export type CreateVideoInput = {
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  category: string;
  tags: string[];
  duration: string;
  featured: boolean;
  trending: boolean;
};

type VideoRow = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  category: string;
  tags: string[] | null;
  view_count: number | null;
  duration: string;
  featured: boolean | null;
  trending: boolean | null;
  created_at: string;
};

function normalizeRow(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    thumbnail_url: row.thumbnail_url ?? "",
    video_url: row.video_url ?? "",
    category: row.category,
    tags: row.tags ?? [],
    view_count: row.view_count ?? 0,
    duration: row.duration ?? "00:00",
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    created_at: row.created_at,
  };
}

export async function fetchVideos(): Promise<Video[]> {
  if (!supabase) return mockVideos;

  const { data, error } = await supabase
    .from("videos")
    .select("id,title,description,thumbnail_url,video_url,category,tags,view_count,duration,featured,trending,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch videos from Supabase:", error.message);
    return mockVideos;
  }

  return (data as VideoRow[]).map(normalizeRow);
}

export async function createVideo(input: CreateVideoInput): Promise<Video> {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  const payload = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    thumbnail_url: input.thumbnail_url,
    video_url: input.video_url,
    category: input.category,
    tags: input.tags,
    view_count: 0,
    duration: input.duration,
    featured: input.featured,
    trending: input.trending,
  };

  const { data, error } = await supabase
    .from("videos")
    .insert(payload)
    .select("id,title,description,thumbnail_url,video_url,category,tags,view_count,duration,featured,trending,created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create video.");
  }

  return normalizeRow(data as VideoRow);
}
