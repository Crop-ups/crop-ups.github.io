
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, BadgePercent, Gift } from "lucide-react";

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
  title = "Special Discount Offer",
  message = "Enjoy 20% off on all products with code: WELCOME20",
  buttonText = "Claim Now",
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
      <DialogContent 
        className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-lg border-0 shadow-xl" 
        closeButton={!preventClose}
      >
        <div className="relative">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-herb-400 to-herb-600 opacity-90"
          />
          
          {/* Header content */}
          <div className="relative flex items-center justify-between p-5 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <BadgePercent className="h-8 w-8 text-white" />
              <h2 className="text-xl font-serif font-bold text-white">{title}</h2>
            </div>
          </div>

          {/* Main content with decorative elements */}
          <div className="relative p-6 bg-white">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-herb-300 rounded-tl-lg -mt-2 -ml-2 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-herb-300 rounded-br-lg -mb-2 -mr-2 opacity-60"></div>
            
            {/* Discount message */}
            <div className="mb-6 text-center">
              <p className="text-lg font-medium mb-3">{message}</p>
              <div className="inline-block bg-herb-100 px-4 py-2 rounded-md font-bold text-herb-800 border border-herb-300 tracking-wider">
                WELCOME20
              </div>
            </div>
            
            {/* Gift icon */}
            <div className="flex justify-center mb-4">
              <Gift className="h-12 w-12 text-herb-500" />
            </div>
            
            {/* Action button */}
            <div className="flex justify-center gap-4">
              <Button 
                className="bg-herb-600 hover:bg-herb-700 text-white font-semibold py-2 px-6 rounded-md transition-colors shadow-md"
                onClick={() => {
                  if (!preventClose) {
                    handleOpenChange(false);
                  }
                }}
              >
                {buttonText}
              </Button>
            </div>
            
            {/* Small print */}
            <div className="text-center mt-4 text-xs text-gray-500">
              *Offer valid for new customers. Expires in 24 hours.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPopup;
