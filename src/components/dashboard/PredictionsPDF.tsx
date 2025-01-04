import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  totalScore: {
    fontSize: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  totalScoreLabel: {
    color: '#666',
  },
  totalScoreValue: {
    color: '#FF6B00',
    fontFamily: 'Helvetica-Bold',
  },
  gamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gameCard: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  teams: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    color: '#333',
  },
  scoreContainer: {
    marginTop: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 12,
    width: 20,
    color: '#666',
    marginRight: 8,
  },
  score: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  points: {
    fontSize: 14,
    color: '#FF6B00',
    textAlign: 'right',
    marginTop: 8,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#666',
    fontSize: 12,
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
  
  // Create pairs of predictions for the 2-column layout
  const predictionPairs = [];
  for (let i = 0; i < predictions.length; i += 2) {
    predictionPairs.push(predictions.slice(i, i + 2));
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>euroleague.bet</Text>
          <Text style={styles.subtitle}>{roundName} by @{userName}</Text>
          <Text style={styles.date}>
            {format(new Date(predictions[0]?.game.game_date || new Date()), 'MMM d, yyyy')}
          </Text>
          <View style={styles.totalScore}>
            <Text style={styles.totalScoreLabel}>Total Score:</Text>
            <Text style={styles.totalScoreValue}>{totalPoints}</Text>
          </View>
        </View>

        {predictionPairs.map((pair, pairIndex) => (
          <View key={pairIndex} style={styles.gamesRow}>
            {pair.map((pred, index) => (
              <View key={index} style={styles.gameCard}>
                <Text style={styles.teams}>
                  {pred.game.home_team.name} vs {pred.game.away_team.name}
                </Text>

                <View style={styles.scoreContainer}>
                  {pred.game.game_results?.[0] && (
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>F</Text>
                      <Text style={styles.score}>
                        {pred.game.game_results[0].home_score}-{pred.game.game_results[0].away_score}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>P</Text>
                    <Text style={styles.score}>
                      {pred.prediction.prediction_home_score}-{pred.prediction.prediction_away_score}
                    </Text>
                  </View>
                </View>

                {pred.prediction.points_earned !== undefined && (
                  <Text style={styles.points}>
                    {pred.prediction.points_earned}p
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text>euroleague.bet</Text>
          <Text>F = Final     P = Prediction</Text>
        </View>
      </Page>
    </Document>
  );
};