import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload, Trash2, Reply } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  image_url?: string;
  created_at: string;
  reply?: string;
  admin_reply: boolean;
  replied_at?: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return;
    }

    setReviews(data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('reviews')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('reviews')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_name: userName,
        rating,
        comment,
        image_url: imageUrl
      });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Your review has been added successfully!",
      });

      setUserName('');
      setRating(5);
      setComment('');
      setImage(null);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review deleted",
        description: "The review has been removed successfully.",
      });

      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          reply: replyText,
          admin_reply: true,
          replied_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Reply submitted",
        description: "Your reply has been added successfully!",
      });

      setReplyText('');
      setReplyingTo(null);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to submit reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Product Reviews</h3>
      
      <form onSubmit={handleSubmit} className="bg-[#c0c0c0] border border-[#808080] p-4 mb-6">
        <div className="mb-4">
          <label className="block mb-2">Your Name</label>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Review</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Image (optional)</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="bg-white"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="sketchy-button"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#c0c0c0] border border-[#808080] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">{review.user_name}</p>
                <div className="flex text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                {user?.isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(review.id)}
                      className="text-blue-500"
                    >
                      <Reply className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className="mb-2">{review.comment}</p>
            {review.image_url && (
              <img 
                src={review.image_url} 
                alt="Review" 
                className="max-w-full h-auto rounded"
              />
            )}
            
            {review.reply && (
              <div className="mt-4 pl-4 border-l-2 border-blue-500">
                <p className="text-sm font-semibold text-blue-600">Admin Reply:</p>
                <p className="text-sm mt-1">{review.reply}</p>
                {review.replied_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.replied_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!replyingTo} onOpenChange={() => setReplyingTo(null)}>
        <DialogContent className="bg-[#c0c0c0] border border-[#808080]">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="bg-white min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => replyingTo && handleReply(replyingTo)}
              className="sketchy-button"
            >
              Submit Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductReviews;