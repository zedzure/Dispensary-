
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function InventoryReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Warehouse className="h-6 w-6" />
          Inventory Reports
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will find reports on stock levels, turnover, and inventory valuation.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
