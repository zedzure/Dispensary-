
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function RolesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <ShieldCheck className="h-6 w-6" />
          Roles & Permissions
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you can define roles and manage user permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
