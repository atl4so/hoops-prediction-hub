export function PageHeader({ 
  title, 
  description 
}: { 
  title: string;
  description?: string;
}) {
  return (
    <section className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          {description}
        </p>
      )}
    </section>
  );
}