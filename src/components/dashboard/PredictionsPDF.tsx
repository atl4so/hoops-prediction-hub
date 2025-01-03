import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    position: 'relative',
    fontFamily: 'Helvetica',
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
    marginBottom: 30,
    borderBottom: '2px solid #eee',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 10,
  },
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
    objectFit: 'contain',
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
  totalPoints: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
    textAlign: 'right',
    borderTop: '2px solid #eee',
    paddingTop: 20,
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
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>euroleague.bet</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Predictions Report</Text>
          <View style={styles.userInfo}>
            {userAvatar && (
              <Image
                src={userAvatar}
                style={styles.avatar}
              />
            )}
            <View>
              <Text style={styles.subtitle}>User: {userName}</Text>
              <Text style={styles.subtitle}>Round: {roundName}</Text>
              <Text style={styles.subtitle}>
                Generated on: {format(new Date(), 'PPP')}
              </Text>
            </View>
          </View>
        </View>

        {predictions.map((pred, index) => {
          const gameResult = pred.game.game_results?.[0];
          
          return (
            <View key={index} style={styles.prediction}>
              <Text style={styles.gameInfo}>
                {format(new Date(pred.game.game_date), 'PPp')}
              </Text>
              
              <View style={styles.teamsContainer}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Image
                    src={pred.game.home_team.logo_url}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.teamName}>{pred.game.home_team.name}</Text>
                </View>
                
                <Text style={{ marginHorizontal: 10 }}>vs</Text>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Image
                    src={pred.game.away_team.logo_url}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.teamName}>{pred.game.away_team.name}</Text>
                </View>
              </View>

              <View style={styles.scores}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Your Prediction</Text>
                  <Text style={styles.scoreValue}>
                    {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
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

              {pred.prediction.points_earned !== undefined && (
                <Text style={styles.points}>
                  Points earned: {pred.prediction.points_earned}
                </Text>
              )}
            </View>
          );
        })}

        <Text style={styles.totalPoints}>
          Total Points for Round: {totalPoints}
        </Text>
      </Page>
    </Document>
  );
};