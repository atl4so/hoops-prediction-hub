import { OverviewHeader } from "@/components/overview/OverviewHeader";

export default function Overview() {
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <section className="text-center space-y-4 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-black">
          Overview
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your prediction journey at a glance
        </p>
      </section>
      <OverviewHeader />
    </div>
  );
}