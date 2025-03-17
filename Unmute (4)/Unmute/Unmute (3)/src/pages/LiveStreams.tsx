import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { Button } from '../components/ui/Button';

export default function LiveStreams() {
  const { supabase } = useSupabase();
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching streams:', error);
      return;
    }
    setStreams(data || []);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Live Streams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <div key={stream.id} className="bg-white rounded-lg shadow p-4">
            <h2>{stream.title}</h2>
            <p>{stream.description}</p>
            <Button>Join Stream</Button>
          </div>
        ))}
      </div>
    </div>
  );
}