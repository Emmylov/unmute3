import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { Spinner } from '../components/ui/Spinner';

export default function Explore() {
  const { supabase } = useSupabase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('likes_count', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4 p-4">
      {posts.map((post) => (
        <div key={post.id} className="aspect-square">
          <img
            src={post.media_url}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}