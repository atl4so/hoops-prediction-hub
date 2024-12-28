import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkText: {
    fontSize: 60,
    color: '#888',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  prediction: {
    marginBottom: 15,
    padding: 10,
    borderBottom: '1px solid #eee',
  },
  gameInfo: {
    marginBottom: 5,
  },
  scores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  points: {
    marginTop: 5,
    color: '#0066cc',
  },
  totalPoints: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
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
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>euroleague.bet</Text>
        </View>

        {/* Content */}
        <View style={styles.header}>
          <Text style={styles.title}>Predictions Report</Text>
          <Text style={styles.subtitle}>User: {userName}</Text>
          <Text style={styles.subtitle}>Round: {roundName}</Text>
          <Text style={styles.subtitle}>
            Generated on: {format(new Date(), 'PPP')}
          </Text>
        </View>

        {predictions.map((pred, index) => (
          <View key={index} style={styles.prediction}>
            <Text style={styles.gameInfo}>
              {format(new Date(pred.game.game_date), 'PPp')}
            </Text>
            <Text style={styles.gameInfo}>
              {pred.game.home_team.name} vs {pred.game.away_team.name}
            </Text>
            <Text style={styles.scores}>
              Prediction: {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
            </Text>
            {pred.prediction.points_earned !== undefined && (
              <Text style={styles.points}>
                Points earned: {pred.prediction.points_earned}
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.totalPoints}>
          Total Points for Round: {totalPoints}
        </Text>
      </Page>
    </Document>
  );
};