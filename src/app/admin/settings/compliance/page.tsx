
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";

export default function CompliancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Link2 className="h-6 w-6" />
          Compliance & Integrations
        </CardTitle>
        <CardDescription>
          This section is under construction. Manage METRC/BioTrack integrations and automated compliance reporting.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
