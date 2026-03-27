interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  onEnded?: () => void;
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

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v|mkv|avi)(\?.*)?$/i.test(url);
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title, onEnded }: VideoPlayerProps) {
  const url = videoUrl?.trim();

  if (!url) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-900/10 to-background flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-medium text-foreground">No video source</p>
        <p className="text-sm text-muted-foreground">
          Upload a video file or paste a YouTube / Vimeo / direct video URL in the admin panel.
        </p>
      </div>
    );
  }

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title ?? "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://player.vimeo.com/video/${vimeoId}?dnt=1`}
        title={title ?? "Video"}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isDirectVideoUrl(url) || url.startsWith("blob:") || url.includes("supabase")) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-contain bg-black"
        src={url}
        poster={thumbnailUrl || undefined}
        controls
        playsInline
        onEnded={onEnded}
      />
    );
  }

  // Unknown URL — attempt playing as video and show fallback link
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-900/10 to-background flex flex-col items-center justify-center gap-4 px-6 text-center">
      <video
        className="w-full h-full object-contain bg-black"
        src={url}
        poster={thumbnailUrl || undefined}
        controls
        playsInline
        onEnded={onEnded}
        onError={() => {
          /* show fallback below */
        }}
      />
      <p className="text-xs text-muted-foreground absolute bottom-4">
        If the video doesn't load,{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          open it directly
        </a>
        .
      </p>
    </div>
  );
}
