
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface CustomPopupProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
  buttonText?: string;
  showAfterMs?: number;
  preventClose?: boolean;
}

const CustomPopup = ({
  open: controlledOpen,
  onOpenChange,
  title = "Important Notice",
  message = "This is an important message for you to read.",
  buttonText = "Understand",
  showAfterMs = 5000,
  preventClose = false
}: CustomPopupProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (preventClose && open) {
      // Prevent closing if preventClose is true and popup is open
      return;
    }
    
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  useEffect(() => {
    // If uncontrolled and we want to show after delay
    if (!isControlled && showAfterMs > 0) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, showAfterMs);
      
      return () => clearTimeout(timer);
    }
  }, [isControlled, showAfterMs]);
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden" closeButton={!preventClose}>
        <div className="flex items-center justify-between p-4 border-b bg-[#0078D4] text-white">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6" />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-6 text-center">{message}</p>
          
          <div className="flex justify-center gap-4">
            <Button 
              className="bg-[#0078D4] hover:bg-[#006cc1]"
              onClick={() => {
                if (!preventClose) {
                  handleOpenChange(false);
                }
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPopup;
