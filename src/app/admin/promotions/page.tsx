
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

export default function PromotionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cursive text-primary">
          <Tag className="h-6 w-6" />
          Promotions & Coupons
        </CardTitle>
        <CardDescription>
          This section is under construction. Here you will be able to create and manage promotions and coupons.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
