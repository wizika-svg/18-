import { parseVideoSource } from "@/lib/video-source";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  onEnded?: () => void;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title, onEnded }: VideoPlayerProps) {
  const source = parseVideoSource(videoUrl);
  const url = source.playableUrl?.trim();

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

  if (["youtube", "vimeo", "dailymotion", "tiktok", "embed"].includes(source.kind)) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={url}
        title={title ?? "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (source.kind === "direct") {
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
