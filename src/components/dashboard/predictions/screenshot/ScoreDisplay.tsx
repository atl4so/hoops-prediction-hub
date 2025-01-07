interface ScoreDisplayProps {
  homeScore: number;
  awayScore: number;
}

export function ScoreDisplay({ homeScore, awayScore }: ScoreDisplayProps) {
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    margin: '16px 0',
    whiteSpace: 'nowrap'
  };

  const baseScoreStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '24px',
    fontWeight: '600',
    borderRadius: '8px'
  };

  const winnerStyle: React.CSSProperties = {
    ...baseScoreStyle,
    backgroundColor: '#F97316',
    color: '#FFFFFF'
  };

  const loserStyle: React.CSSProperties = {
    ...baseScoreStyle,
    backgroundColor: '#FFF7ED',
    color: '#1a1a1a'
  };

  const separatorStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a'
  };

  return (
    <div style={containerStyle}>
      <span style={homeScore > awayScore ? winnerStyle : loserStyle}>
        {homeScore}
      </span>
      <span style={separatorStyle}>-</span>
      <span style={awayScore > homeScore ? winnerStyle : loserStyle}>
        {awayScore}
      </span>
    </div>
  );
}