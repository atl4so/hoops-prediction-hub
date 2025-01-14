import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/users/FollowButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface FollowedUserCardProps {
  user: {
    id: string;
    display_name: string;
    total_points: number;
    points_per_game: number;
    avatar_url?: string;
    winner_predictions_correct?: number;
    winner_predictions_total?: number;
    home_winner_predictions_correct?: number;
    home_winner_predictions_total?: number;
    away_winner_predictions_correct?: number;
    away_winner_predictions_total?: number;
  };
  onUserClick: (user: { id: string; display_name: string }) => void;
  onFollowChange: () => void;
  isFollowing: boolean;
}

export function FollowedUserCard({ user, onUserClick, onFollowChange, isFollowing }: FollowedUserCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const calculatePercentage = (correct?: number, total?: number) => {
    if (!correct || !total) return 0;
    return Math.round((correct / total) * 100);
  };

  const winnerPercentage = calculatePercentage(user.winner_predictions_correct, user.winner_predictions_total);
  const homeWinPercentage = calculatePercentage(user.home_winner_predictions_correct, user.home_winner_predictions_total);
  const awayWinPercentage = calculatePercentage(user.away_winner_predictions_correct, user.away_winner_predictions_total);

  return (
    <Card className="group hover:shadow-md transition-all duration-300 animate-fade-in">
      <CardContent className="p-5 sm:p-6">
        <div className="space-y-4">
          {/* Main row with avatar, name, and follow button */}
          <div className="flex items-center gap-4">
            <Avatar 
              className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-primary/20 shrink-0"
              onClick={() => onUserClick({
                id: user.id,
                display_name: user.display_name
              })}
            >
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.display_name} />
              ) : null}
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p 
                className="font-display font-semibold break-words cursor-pointer hover:text-primary transition-colors text-base sm:text-lg"
                onClick={() => onUserClick({
                  id: user.id,
                  display_name: user.display_name
                })}
              >
                {user.display_name}
              </p>
            </div>

            <FollowButton
              userId={user.id}
              isFollowing={isFollowing}
              onFollowChange={onFollowChange}
              className="shrink-0 h-8 px-3 text-xs sm:text-sm"
            />
          </div>

          {/* Collapsible stats section */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-center py-1 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-3 animate-accordion-down">
              <div className="flex flex-wrap gap-3 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {user.total_points} pts
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Total Points</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        {user.points_per_game?.toFixed(1)} PPG
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Points Per Game</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {winnerPercentage > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="text-xs sm:text-sm">
                          Winner: {winnerPercentage}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {user.winner_predictions_correct} correct out of {user.winner_predictions_total}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {(homeWinPercentage > 0 || awayWinPercentage > 0) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs sm:text-sm">
                          H/A: {homeWinPercentage}%/{awayWinPercentage}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Home: {user.home_winner_predictions_correct} of {user.home_winner_predictions_total}</p>
                        <p>Away: {user.away_winner_predictions_correct} of {user.away_winner_predictions_total}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}