import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import PostCard from '../components/PostCard';
import { Spinner } from '../components/ui/Spinner';

export default function Home() {
  const { supabase, user } = useSupabase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
}