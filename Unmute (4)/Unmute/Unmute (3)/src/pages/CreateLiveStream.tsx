import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Button } from '../components/ui/Button';

export default function CreateLiveStream() {
  const { supabase, user } = useSupabase();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { data, error } = await supabase
      .from('live_streams')
      .insert([
        {
          user_id: user.id,
          title,
          description,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating stream:', error);
      // Add error handling here, e.g., display an error message to the user.
      return;
    }

    navigate(`/live/${data.id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Live Stream</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Stream Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <Button type="submit">Start Streaming</Button>
      </form>
    </div>
  );
}