import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  prediction: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  gameInfo: {
    marginBottom: 10,
    color: '#444',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamLogo: {
    width: 30,
    height: 30,
  },
  teamName: {
    fontSize: 14,
    color: '#333',
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 20,
  },
  scoreBox: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  points: {
    marginTop: 10,
    color: '#0066cc',
    fontSize: 14,
    textAlign: 'right',
  },
});

interface PDFPredictionProps {
  game: {
    game_date: string;
    home_team: {
      name: string;
      logo_url: string;
    };
    away_team: {
      name: string;
      logo_url: string;
    };
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
}

export const PDFPrediction = ({ game, prediction }: PDFPredictionProps) => {
  const gameResult = game.game_results?.[0];
  
  return (
    <View style={styles.prediction}>
      <Text style={styles.gameInfo}>
        {format(new Date(game.game_date), 'PPp')}
      </Text>
      
      <View style={styles.teamsContainer}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image
            src={game.home_team.logo_url.replace(/\?.*$/, '')} // Remove query parameters
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{game.home_team.name}</Text>
        </View>
        
        <Text style={{ marginHorizontal: 10 }}>vs</Text>
        
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image
            src={game.away_team.logo_url.replace(/\?.*$/, '')} // Remove query parameters
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{game.away_team.name}</Text>
        </View>
      </View>

      <View style={styles.scores}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Your Prediction</Text>
          <Text style={styles.scoreValue}>
            {prediction.prediction_home_score} - {prediction.prediction_away_score}
          </Text>
        </View>

        {gameResult && (
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Final Result</Text>
            <Text style={styles.scoreValue}>
              {gameResult.home_score} - {gameResult.away_score}
            </Text>
          </View>
        )}
      </View>

      {prediction.points_earned !== undefined && (
        <Text style={styles.points}>
          Points earned: {prediction.points_earned}
        </Text>
      )}
    </View>
  );
};