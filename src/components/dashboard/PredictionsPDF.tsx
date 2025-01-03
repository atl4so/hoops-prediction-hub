import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    borderBottom: 1,
    paddingBottom: 10,
    borderColor: '#e2e2e2',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 48,
    opacity: 0.1,
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  points: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 15,
  },
  game: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  teams: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  date: {
    fontSize: 10,
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  scoreBox: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  score: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  earnedPoints: {
    fontSize: 11,
    color: '#FF6B00',
    textAlign: 'right',
    marginTop: 4,
  },
});

interface PredictionsPDFProps {
  userName: string;
  roundName: string;
  predictions: Array<{
    game: {
      game_date: string;
      home_team: {
        name: string;
      };
      away_team: {
        name: string;
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
  }>;
}

export const PredictionsPDF = ({ userName, roundName, predictions }: PredictionsPDFProps) => {
  const totalPoints = predictions.reduce((sum, p) => sum + (p.prediction.points_earned || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>euroleague.bet</Text>
        
        <View style={styles.header}>
          <Text style={styles.title}>euroleague.bet</Text>
          <Text style={styles.info}>User: {userName}</Text>
          <Text style={styles.info}>Round: {roundName}</Text>
          <Text style={styles.info}>Generated: {format(new Date(), 'PP')}</Text>
          <Text style={styles.points}>Total Points: {totalPoints}</Text>
        </View>

        {predictions.map((pred, index) => (
          <View key={index} style={styles.game}>
            <View style={styles.gameHeader}>
              <Text style={styles.teams}>
                {pred.game.home_team.name} vs {pred.game.away_team.name}
              </Text>
              <Text style={styles.date}>
                {format(new Date(pred.game.game_date), 'PP')}
              </Text>
            </View>

            <View style={styles.scores}>
              {pred.game.game_results?.[0] && (
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Final Result</Text>
                  <Text style={styles.score}>
                    {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                  </Text>
                </View>
              )}
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>Your Prediction</Text>
                <Text style={styles.score}>
                  {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                </Text>
              </View>
            </View>

            {pred.prediction.points_earned !== undefined && (
              <Text style={styles.earnedPoints}>
                Points earned: {pred.prediction.points_earned}
              </Text>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};