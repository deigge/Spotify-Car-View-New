export type SpotifyPlayer = {
  item: {
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    duration_ms: number;
  };
  progress_ms: number;
  is_playing: boolean;
  context?: {
    type: 'playlist' | 'album' | 'artist' | null;
    uri: string;
  };
};
