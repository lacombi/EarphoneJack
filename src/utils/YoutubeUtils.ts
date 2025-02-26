import { api } from "../services/api";

interface ItemProps {
  snippet: {
    title: string;
  };
  id: {
    videoId: string;
  };
}

export async function seachVideos(query: string) {
  const { data } = await api.get('/search', {
    params: {
      part: 'snippet',
      type: 'video',
      maxResults: 10,
      q: query,
      key: process.env.YOUTUBE_KEY,
    }
  });

  return data.items.map((item: ItemProps) => (
    {
      title: item.snippet.title,
      video_id: item.id.videoId,
    }
  ));
}