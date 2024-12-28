import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
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
        toast({
          title: "Authentication required",
          description: "Please sign in to follow users",
          variant: "destructive",
        });
        return;
      }

      if (isFollowing) {
        // Check if follow relationship exists before deleting
        const { data: existingFollow } = await supabase
          .from("user_follows")
          .select()
          .eq("follower_id", user.id)
          .eq("following_id", userId)
          .maybeSingle();

        if (existingFollow) {
          // Unfollow
          const { error } = await supabase
            .from("user_follows")
            .delete()
            .eq("follower_id", user.id)
            .eq("following_id", userId);

          if (error) throw error;

          setIsFollowing(false);
          toast({
            title: "Unfollowed",
            description: "You are no longer following this user",
          });
        }
      } else {
        // Check if follow relationship already exists
        const { data: existingFollow } = await supabase
          .from("user_follows")
          .select()
          .eq("follower_id", user.id)
          .eq("following_id", userId)
          .maybeSingle();

        if (!existingFollow) {
          // Follow
          const { error } = await supabase.from("user_follows").insert({
            follower_id: user.id,
            following_id: userId,
          });

          if (error) throw error;

          setIsFollowing(true);
          toast({
            title: "Following",
            description: "You are now following this user",
          });
        }
      }

      // Callback is now optional and only called if provided
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "destructive" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className={cn(className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}