import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { Card } from '../components/ui/Card';
import { BarChart, Users, Video, MessageSquare } from 'lucide-react';

export default function CreatorDashboard() {
  const { supabase, user } = useSupabase();
  const [stats, setStats] = useState({
    followers: 0,
    posts: 0,
    reels: 0,
    engagement: 0
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    // Fetch followers count
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_id', user.id);

    // Fetch posts count
    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Fetch reels count
    const { count: reelsCount } = await supabase
      .from('reels')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    setStats({
      followers: followersCount || 0,
      posts: postsCount || 0,
      reels: reelsCount || 0,
      engagement: calculateEngagement(followersCount || 0, postsCount || 0)
    });
  };

  const calculateEngagement = (followers: number, posts: number) => {
    return followers > 0 && posts > 0 ? ((followers / posts) * 100).toFixed(1) : 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <h2 className="text-2xl font-bold">{stats.followers}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <BarChart className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-600">Posts</p>
              <h2 className="text-2xl font-bold">{stats.posts}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Video className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-600">Reels</p>
              <h2 className="text-2xl font-bold">{stats.reels}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <h2 className="text-2xl font-bold">{stats.engagement}%</h2>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}