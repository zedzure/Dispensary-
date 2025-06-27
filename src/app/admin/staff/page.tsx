
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function StaffPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Briefcase className="h-6 w-6" />
          Manage Staff
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will be able to manage staff accounts, schedules, and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
