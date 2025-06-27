
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <ShoppingCart className="h-6 w-6" />
          View All Orders
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will be able to view all orders and their current status.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
