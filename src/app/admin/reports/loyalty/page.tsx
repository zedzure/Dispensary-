
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function LoyaltyReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <BarChart3 className="h-6 w-6" />
          Loyalty Program Reports
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will find statistics about your loyalty program.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
