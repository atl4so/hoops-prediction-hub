export function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground">
        No games available for predictions at the moment.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Check back later for upcoming games.
      </p>
    </div>
  );
}