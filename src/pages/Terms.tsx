import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container max-w-4xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Terms & Conditions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            euroleague.bet is a free prediction game website and is not associated with gambling 
            or betting of any kind. No money is involved in any aspect of the website's operation.
          </p>
          <p>
            This website is not affiliated with, endorsed by, or connected to EuroLeague Basketball 
            or any of its associated entities. All team names, logos, and related marks are 
            trademarks of their respective owners.
          </p>
          <p>
            By using this website, you acknowledge and agree that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>This is not a gambling website and no real money is involved</li>
            <li>We are not affiliated with EuroLeague Basketball</li>
            <li>Team logos and names are property of their respective owners</li>
            <li>We provide this service for entertainment purposes only</li>
            <li>You are responsible for keeping your account credentials secure</li>
            <li>We may update these terms at any time without notice</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you wish to delete your account and all associated data, please contact us on X (Twitter) at{' '}
              <a 
                href="https://twitter.com/beteuroleague" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @beteuroleague
              </a>
              . We will process your request as soon as possible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}