
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function TaxRulesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Landmark className="h-6 w-6" />
          Tax Rules
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you can define and manage tax rules.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
