export type VideoSourceKind =
  | "direct"
  | "youtube"
  | "vimeo"
  | "dailymotion"
  | "tiktok"
  | "embed"
  | "unknown";

export interface ParsedVideoSource {
  kind: VideoSourceKind;
  originalUrl: string;
  playableUrl: string;
}

function withProtocol(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

function getDailymotionId(url: string): string | null {
  const match = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

function getTikTokId(url: string): string | null {
  const match = url.match(/tiktok\.com\/.+\/video\/(\d+)/);
  return match ? match[1] : null;
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v|mkv|avi)(\?.*)?$/i.test(url);
}

export function parseVideoSource(rawUrl: string): ParsedVideoSource {
  const normalized = withProtocol(rawUrl);

  if (!normalized) {
    return {
      kind: "unknown",
      originalUrl: "",
      playableUrl: "",
    };
  }

  const youtubeId = getYouTubeId(normalized);
  if (youtubeId) {
    return {
      kind: "youtube",
      originalUrl: normalized,
      playableUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`,
    };
  }

  const vimeoId = getVimeoId(normalized);
  if (vimeoId) {
    return {
      kind: "vimeo",
      originalUrl: normalized,
      playableUrl: `https://player.vimeo.com/video/${vimeoId}?dnt=1`,
    };
  }

  const dailymotionId = getDailymotionId(normalized);
  if (dailymotionId) {
    return {
      kind: "dailymotion",
      originalUrl: normalized,
      playableUrl: `https://www.dailymotion.com/embed/video/${dailymotionId}`,
    };
  }

  const tiktokId = getTikTokId(normalized);
  if (tiktokId) {
    return {
      kind: "tiktok",
      originalUrl: normalized,
      playableUrl: `https://www.tiktok.com/embed/v2/${tiktokId}`,
    };
  }

  if (normalized.includes("youtube.com/embed/") || normalized.includes("player.vimeo.com/video/")) {
    return {
      kind: "embed",
      originalUrl: normalized,
      playableUrl: normalized,
    };
  }

  if (normalized.startsWith("blob:") || normalized.includes("supabase") || isDirectVideoUrl(normalized)) {
    return {
      kind: "direct",
      originalUrl: normalized,
      playableUrl: normalized,
    };
  }

  return {
    kind: "unknown",
    originalUrl: normalized,
    playableUrl: normalized,
  };
}
