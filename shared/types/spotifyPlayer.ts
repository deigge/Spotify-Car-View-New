export type SpotifyPlayer = {
  item: {
    id: string;
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      name: string;
      images: { url: string; height: number; width: number }[];
    };
    duration_ms: number;
    external_urls: {
      spotify: string;
    };
  };
  shuffle_state: boolean;
  repeat_state: string;
  progress_ms: number;
  is_playing: boolean;
  context?: {
    type: 'playlist' | 'album' | 'artist' | null;
    uri: string;
  };
};
