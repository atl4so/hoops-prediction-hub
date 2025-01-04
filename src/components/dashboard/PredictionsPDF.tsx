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
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  info: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
    color: '#666',
  },
  gamesGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gameCard: {
    width: '31%',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  teams: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 8,
    color: '#666',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 8,
    color: '#666',
  },
  score: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  points: {
    fontSize: 9,
    color: '#FF6B00',
    textAlign: 'right',
    marginTop: 4,
  }
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
        <View style={styles.header}>
          <Text style={styles.title}>euroleague.bet - Round Predictions</Text>
          <Text style={styles.info}>User: {userName}</Text>
          <Text style={styles.info}>Round: {roundName}</Text>
          <Text style={styles.info}>Total Points: {totalPoints}</Text>
          <Text style={styles.info}>Generated: {format(new Date(), 'PP')}</Text>
        </View>

        <View style={styles.gamesGrid}>
          {predictions.map((pred, index) => (
            <View key={index} style={styles.gameCard}>
              <Text style={styles.teams}>
                {pred.game.home_team.name} vs {pred.game.away_team.name}
              </Text>
              <Text style={styles.date}>
                {format(new Date(pred.game.game_date), 'PP')}
              </Text>

              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Prediction:</Text>
                <Text style={styles.score}>
                  {pred.prediction.prediction_home_score}-{pred.prediction.prediction_away_score}
                </Text>
              </View>

              {pred.game.game_results?.[0] && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Final Score:</Text>
                  <Text style={styles.score}>
                    {pred.game.game_results[0].home_score}-{pred.game.game_results[0].away_score}
                  </Text>
                </View>
              )}

              {pred.prediction.points_earned !== undefined && (
                <Text style={styles.points}>
                  Points: {pred.prediction.points_earned}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};