
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function LocationManagementPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Map className="h-6 w-6" />
          Location Management
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you can manage your dispensary locations.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
