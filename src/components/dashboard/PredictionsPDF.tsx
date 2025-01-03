import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFHeader } from './pdf/PDFHeader';
import { PDFPrediction } from './pdf/PDFPrediction';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    position: 'relative',
    fontFamily: 'Helvetica',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.3,
    fontSize: 80,
    color: '#888',
  },
});

interface PredictionsPDFProps {
  userName: string;
  userAvatar?: string;
  roundName: string;
  predictions: Array<{
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
  }>;
}

export const PredictionsPDF = ({ userName, userAvatar, roundName, predictions }: PredictionsPDFProps) => {
  const totalPoints = predictions.reduce((sum, p) => sum + (p.prediction.points_earned || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader
          userName={userName}
          userAvatar={userAvatar}
          roundName={roundName}
          totalPoints={totalPoints}
        />
        
        {predictions.map((pred, index) => (
          <PDFPrediction
            key={index}
            game={pred.game}
            prediction={pred.prediction}
          />
        ))}

        <Text style={styles.watermark}>euroleague.bet</Text>
      </Page>
    </Document>
  );
};