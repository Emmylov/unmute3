import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

export default function Notifications() {
  const { supabase, user } = useSupabase();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles!actor_id(username, avatar_url)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }
    setNotifications(data || []);
  };

  const subscribeToNotifications = () => {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={notification.actor.avatar_url}
              alt={notification.actor.username}
              className="w-10 h-10 rounded-full inline mr-2"
            />
            <span>{notification.actor.username}</span>
            <p>{notification.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}