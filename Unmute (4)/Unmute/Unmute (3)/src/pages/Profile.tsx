
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import PostGrid from '../components/PostGrid';
import ReelsGrid from '../components/ReelsGrid';

export default function Profile() {
  const { username } = useParams();
  const { supabase, user } = useSupabase();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchReels();
    checkFollowStatus();
    fetchFollowCounts();
  }, [username]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (data) setProfile(data);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
  };

  const fetchReels = async () => {
    const { data } = await supabase
      .from('reels')
      .select('*')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false });

    if (data) setReels(data);
  };

  const checkFollowStatus = async () => {
    if (!user || !profile) return;

    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', profile.id)
      .single();

    setIsFollowing(!!data);
  };

  const fetchFollowCounts = async () => {
    if (!profile) return;

    const { count: followers } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_id', profile.id);

    const { count: following } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('follower_id', profile.id);

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const handleFollow = async () => {
    if (!user || !profile) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', profile.id);
    } else {
      await supabase
        .from('follows')
        .insert([{ follower_id: user.id, following_id: profile.id }]);
    }

    setIsFollowing(!isFollowing);
    fetchFollowCounts();
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-8 mb-8">
        <img
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <p className="text-gray-600">@{profile.username}</p>
          <p className="mt-2">{profile.bio}</p>
          <div className="flex gap-4 mt-4">
            <span>{followersCount} followers</span>
            <span>{followingCount} following</span>
          </div>
          {user && user.id !== profile.id && (
            <Button onClick={handleFollow} className="mt-4">
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostGrid posts={posts} />
        </TabsContent>
        <TabsContent value="reels">
          <ReelsGrid reels={reels} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
