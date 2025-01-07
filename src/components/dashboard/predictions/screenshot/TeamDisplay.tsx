interface TeamDisplayProps {
  name: string;
  logoUrl: string;
}

export function TeamDisplay({ name, logoUrl }: TeamDisplayProps) {
  const imageStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    objectFit: "contain"
  };

  const nameStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.4",
    marginTop: "12px",
    fontWeight: "500",
    color: "#1a1a1a",
    textAlign: "center"
  };

  return (
    <div>
      <img src={logoUrl} alt={name} style={imageStyle} />
      <p style={nameStyle}>{name}</p>
    </div>
  );
}