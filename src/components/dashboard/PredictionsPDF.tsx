import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    opacity: 0.08,
    color: '#666',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
    borderColor: '#e2e2e2',
  },
  websiteTitle: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  totalPoints: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 8,
  },
  predictionsContainer: {
    gap: 8,
  },
  prediction: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  teams: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'Helvetica-Bold',
  },
  gameDate: {
    fontSize: 9,
    color: '#666',
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  scoreBox: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Helvetica-Bold',
  },
  points: {
    fontSize: 11,
    color: '#FF6B00',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
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
          <Text style={styles.websiteTitle}>euroleague.bet</Text>
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>User: {userName}</Text>
            <Text style={styles.infoText}>Round: {roundName}</Text>
            <Text style={styles.infoText}>
              Generated on: {format(new Date(), 'PPP')}
            </Text>
            <Text style={styles.totalPoints}>
              Total Points: {totalPoints}
            </Text>
          </View>
        </View>

        <View style={styles.predictionsContainer}>
          {predictions.map((pred, index) => (
            <View key={index} style={styles.prediction}>
              <View style={styles.gameInfo}>
                <Text style={styles.teams}>
                  {pred.game.home_team.name} vs {pred.game.away_team.name}
                </Text>
                <Text style={styles.gameDate}>
                  {format(new Date(pred.game.game_date), 'PP')}
                </Text>
              </View>

              <View style={styles.scores}>
                {pred.game.game_results?.[0] && (
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>Final Result</Text>
                    <Text style={styles.scoreValue}>
                      {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                    </Text>
                  </View>
                )}

                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Your Prediction</Text>
                  <Text style={styles.scoreValue}>
                    {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                  </Text>
                </View>
              </View>

              {pred.prediction.points_earned !== undefined && (
                <Text style={styles.points}>
                  Points earned: {pred.prediction.points_earned}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};