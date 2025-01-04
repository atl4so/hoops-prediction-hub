import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: () => void;
  className?: string;
}

export function FollowButton({ 
  userId, 
  isFollowing: initialIsFollowing, 
  onFollowChange,
  className 
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { toast } = useToast();

  const handleFollow = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error({
          title: "Authentication required",
          description: "Please sign in to follow users",
        });
        return;
      }

      if (isFollowing) {
        const { data: existingFollow } = await supabase
          .from("user_follows")
          .select()
          .eq("follower_id", user.id)
          .eq("following_id", userId)
          .maybeSingle();

        if (existingFollow) {
          const { error } = await supabase
            .from("user_follows")
            .delete()
            .eq("follower_id", user.id)
            .eq("following_id", userId);

          if (error) throw error;

          setIsFollowing(false);
          toast.success({
            title: "Unfollowed",
            description: "You are no longer following this user",
          });
        }
      } else {
        const { data: existingFollow } = await supabase
          .from("user_follows")
          .select()
          .eq("follower_id", user.id)
          .eq("following_id", userId)
          .maybeSingle();

        if (!existingFollow) {
          const { error } = await supabase.from("user_follows").insert({
            follower_id: user.id,
            following_id: userId,
          });

          if (error) throw error;

          setIsFollowing(true);
          toast.success({
            title: "Following",
            description: "You are now following this user",
          });
        }
      }

      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast.error({
        title: "Error",
        description: "Failed to update follow status",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleFollow}
      disabled={loading}
      className={cn(
        "h-9 w-9 transition-all duration-200",
        isFollowing ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
        className
      )}
      title={isFollowing ? "Unfollow" : "Follow"}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart className={cn(
          "h-5 w-5 transition-all duration-200",
          isFollowing ? "fill-current" : "fill-none"
        )} />
      )}
    </Button>
  );
}
