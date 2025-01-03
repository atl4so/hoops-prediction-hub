import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #eee',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a1a1a',
    fontFamily: 'Helvetica-Bold',
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
    marginRight: 10,
  },
  logo: {
    width: 150,
    height: 'auto',
    marginBottom: 15,
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  totalPoints: {
    fontSize: 18,
    color: '#0066cc',
    fontFamily: 'Helvetica-Bold',
  }
});

interface PDFHeaderProps {
  userName: string;
  userAvatar?: string;
  roundName: string;
  totalPoints: number;
}

export const PDFHeader = ({ userName, userAvatar, roundName, totalPoints }: PDFHeaderProps) => (
  <View style={styles.header}>
    <Image
      src="/og-image.png"
      style={styles.logo}
    />
    <Text style={styles.title}>euroleague.bet Predictions Report</Text>
    <View style={styles.userInfo}>
      {userAvatar && (
        <Image
          src={userAvatar.replace(/\?.*$/, '')} // Remove query parameters
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
    <View style={styles.statsContainer}>
      <Text style={styles.totalPoints}>
        Total Points for Round: {totalPoints}
      </Text>
    </View>
  </View>
);