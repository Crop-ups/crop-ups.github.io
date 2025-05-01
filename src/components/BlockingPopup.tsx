
import { useEffect, useState } from "react";
import { X, Leaf } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BlockingPopup = () => {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setOpen(true);
    }, 30000);

    // Prevent refresh and other browser actions
    const preventDefaultAction = (e: KeyboardEvent) => {
      // Prevent F5 and Ctrl+R/Cmd+R
      if (
        e.key === "F5" || 
        ((e.ctrlKey || e.metaKey) && e.key === "r") ||
        e.keyCode === 116
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const preventSelection = (e: Event) => {
      e.preventDefault();
    };

    // Block actions when popup is open
    if (open) {
      // Prevent keyboard shortcuts for refresh
      window.addEventListener("keydown", preventDefaultAction, { capture: true });
      // Prevent right-click
      window.addEventListener("contextmenu", preventContextMenu);
      // Prevent selection
      document.addEventListener("selectstart", preventSelection);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", preventDefaultAction);
      window.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, [open]);

  // You can't close the dialog through normal means
  // The only way out is closing the tab/browser
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="border-herb-600 bg-gradient-to-b from-white to-herb-100/30" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center justify-center gap-2 text-herb-800">
            <Leaf className="h-6 w-6 text-herb-600" /> 
            <span>Discover Nature's Secrets</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center p-4 gap-4">
          <div className="w-20 h-20 rounded-full bg-herb-600/20 flex items-center justify-center">
            <Leaf className="h-10 w-10 text-herb-600" />
          </div>
          
          <h3 className="text-xl font-medium text-herb-800">
            Experience the Power of Herbal Wellness
          </h3>
          
          <p className="text-gray-600">
            Our premium herbal formulations are crafted to enhance your physical, mental, and sexual wellbeing.
          </p>
          
          <div className="border border-dashed border-herb-600/50 p-4 rounded-md bg-herb-50 w-full mt-2">
            <p className="text-herb-800 font-semibold">Special Offer</p>
            <p className="text-2xl font-bold text-herb-600 mt-1">20% OFF</p>
            <p className="text-sm text-gray-600 mt-1">on your first order</p>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            This window cannot be closed. To continue browsing, please close this tab and visit us again.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockingPopup;
