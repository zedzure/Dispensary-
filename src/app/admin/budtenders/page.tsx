
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function BudtendersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <UserCog className="h-6 w-6" />
          Manage Budtenders
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will be able to add, edit, and manage budtender accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
