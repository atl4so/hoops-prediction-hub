interface TeamDisplayProps {
  team: {
    name: string;
    logo_url: string;
  };
  score?: number;
  align: "left" | "right";
}

export function TeamDisplay({ team, score, align }: TeamDisplayProps) {
  return (
    <div className={`flex flex-col items-${align} gap-2`}>
      <img
        src={team.logo_url}
        alt={team.name}
        className="w-16 h-16 object-contain"
      />
      <p className="text-sm font-medium text-center">{team.name}</p>
      {typeof score === 'number' && (
        <span className="text-lg font-bold">{score}</span>
      )}
    </div>
  );
}