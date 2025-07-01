"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { CreateBookingForm } from "../forms/booking/create-booking-form";

interface NewBookingModalProps {
  open: boolean;
  close: () => void;
  onOpenChange: (open: boolean) => void;
  onBookingCreated: () => void;
}

export function NewBookingModal({
  open,
  onOpenChange,
  onBookingCreated,
  close,
}: NewBookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] [&>button]:hidden p-0 m-0">
        <DialogHeader className="py-4 flex flex-row justify-between items-center px-2 border-b border-[#D7D7D7]">
          <DialogTitle className="font-medium text-[18px] text-black px-4">
            Novo Agendamento
          </DialogTitle>
          <X
            size={24}
            onClick={() => {
              close();
              onOpenChange(false);
            }}
            className="cursor-pointer"
          />
        </DialogHeader>
        <CreateBookingForm close={close} onBookingCreated={onBookingCreated} />
      </DialogContent>
    </Dialog>
  );
}
