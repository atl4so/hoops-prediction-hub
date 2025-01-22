import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameOverview } from "@/components/games/details/GameOverview";
import { GameStats } from "@/components/games/details/GameStats";
import { Helmet } from "react-helmet";

export default function Game() {
  const { gameCode } = useParams();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Extract the numeric part from the game code (E2024_198 -> 198)
        const numericGameCode = gameCode?.split('_')[1];
        const seasonCode = gameCode?.split('_')[0];
        
        if (!numericGameCode || !seasonCode) {
          throw new Error('Invalid game code format');
        }

        console.log('Fetching game data with:', { seasonCode, numericGameCode });

        const response = await fetch(
          `https://api-live.euroleague.net/v1/games?seasonCode=${seasonCode}&gameCode=${numericGameCode}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }

        const xmlText = await response.text();
        console.log('Received XML:', xmlText); // Debug log
        
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: ""
        });
        const result = parser.parse(xmlText);
        
        console.log('Parsed game data:', result); // Debug log
        
        setGameData(result.game);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game data');
        setLoading(false);
      }
    };

    if (gameCode) {
      fetchGameData();
    }
  }, [gameCode]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error || 'Failed to load game data'}</p>
      </div>
    );
  }

  const title = `${gameData.localclub.name} vs ${gameData.roadclub.name} - ${gameData.title}`;
  const description = `${gameData.localclub.name} (${gameData.localclub.score}) vs ${gameData.roadclub.name} (${gameData.roadclub.score}) - ${gameData.title} at ${gameData.stadiumname}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <div className="container mx-auto p-4">
        <PageHeader title={title} />
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <GameOverview game={gameData} />
          </TabsContent>

          <TabsContent value="stats">
            <GameStats game={gameData} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}