export type SpotifyPlaylist = {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
  uri: string;
};

export type SpotifyPlaylistsResponse = {
  items: SpotifyPlaylist[];
};