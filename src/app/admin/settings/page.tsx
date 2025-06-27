
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Settings className="h-6 w-6" />
          Dispensary Settings
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will be able to configure dispensary settings, payment keys, and taxes.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
