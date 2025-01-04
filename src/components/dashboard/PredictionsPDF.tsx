import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 10,
    borderBottom: 1,
    paddingBottom: 8,
    borderColor: '#e2e2e2',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
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
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
  },
  points: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  game: {
    width: '31%',
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  gameHeader: {
    marginBottom: 4,
  },
  teams: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  date: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scoreBox: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 1,
  },
  score: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  earnedPoints: {
    fontSize: 9,
    color: '#FF6B00',
    textAlign: 'right',
    marginTop: 2,
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

        <View style={styles.gamesGrid}>
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
                    <Text style={styles.scoreLabel}>Final</Text>
                    <Text style={styles.score}>
                      {pred.game.game_results[0].home_score}-{pred.game.game_results[0].away_score}
                    </Text>
                  </View>
                )}
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Prediction</Text>
                  <Text style={styles.score}>
                    {pred.prediction.prediction_home_score}-{pred.prediction.prediction_away_score}
                  </Text>
                </View>
              </View>

              {pred.prediction.points_earned !== undefined && (
                <Text style={styles.earnedPoints}>
                  {pred.prediction.points_earned}p
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};