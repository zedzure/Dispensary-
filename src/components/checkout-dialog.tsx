
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "./ui/card";
import { CheckCircle } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ isOpen, onOpenChange }: CheckoutDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <Card className="border-0 shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">
                Thank you for your order!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                A budtender will be with you shortly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogAction
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Done
              </AlertDialogAction>
            </AlertDialogFooter>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
