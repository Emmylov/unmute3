import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export default function CreatePost() {
  const navigate = useNavigate();
  const { supabase, user, uploadFile } = useSupabase();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const uploadPath = await uploadFile('posts', filePath, file);
      if (!uploadPath) throw new Error('Failed to upload file');

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        media_url: uploadPath,
        caption,
        media_type: file.type.startsWith('image') ? 'image' : 'video'
      });

      if (error) throw error;
      toast.success('Post created successfully');
      navigate('/home');
    } catch (error) {
      toast.error('Error creating post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-2 border rounded"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
}