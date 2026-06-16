import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface PostRatingProps {
  postId: number;
  initialLikes?: number;
  className?: string;
}

export default function PostRating({ postId, initialLikes = 0, className = "" }: PostRatingProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (hasLiked) {
      setLikes(Math.max(0, likes - 1));
      setHasLiked(false);
      toast.success("Like removed");
    } else {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));
        setLikes(likes + 1);
        setHasLiked(true);
        toast.success("Thanks for liking this post!");
      } catch (error) {
        toast.error("Failed to like post");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant={hasLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={hasLiked ? "bg-red-500 hover:bg-red-600" : ""}
      >
        <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
        <span className="ml-2">{likes}</span>
      </Button>
      <span className="text-sm text-foreground/70">
        {likes === 1 ? "1 person likes this" : `${likes} people like this`}
      </span>
    </div>
  );
}
