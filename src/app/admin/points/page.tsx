
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function PointsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Gift className="h-6 w-6" />
          Manage Loyalty Points
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will be able to adjust or issue loyalty points to users.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
