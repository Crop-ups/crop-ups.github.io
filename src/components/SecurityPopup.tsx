
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SecurityPopupProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showAfterMs?: number;
  preventClose?: boolean;
}

const SecurityPopup = ({
  open: controlledOpen,
  onOpenChange,
  showAfterMs = 15000, // Default to showing after 15 seconds
  preventClose = true // Default to preventing close
}: SecurityPopupProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [userIp, setUserIp] = useState("Loading...");
  const [dateTime, setDateTime] = useState("Loading...");
  
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
  
  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      }));
    };
    
    updateDateTime(); // Initial call
    const interval = setInterval(updateDateTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch user IP
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setUserIp('Unable to fetch IP');
      }
    };
    
    fetchIp();
  }, []);
  
  // Show popup after delay
  useEffect(() => {
    if (!isControlled && showAfterMs > 0) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, showAfterMs);
      
      return () => clearTimeout(timer);
    }
  }, [isControlled, showAfterMs]);
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 border-0 max-w-xl gap-0" closeButton={!preventClose}>
        {/* Header */}
        <div className="bg-white text-black p-3 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center">
            <div className="mr-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" 
                alt="Microsoft Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-base font-bold">Microsoft Windows Security Center</span>
          </div>
          <span className="text-xl text-black pointer-events-none">×</span>
        </div>
        
        {/* Content */}
        <div className="p-5 text-center bg-white border-b border-gray-300">
          <div className="text-[#d83b01] text-sm font-bold">
            (5) Virus/Malware infections have been recognized on your device.
          </div>
          
          <div className="mt-2 text-xs">
            <p>
              Address IP: <span className="text-black">{userIp}</span>{" "}
              <span className="text-black">{dateTime}</span>
            </p>
            <p>Location: Atlanta, United States</p>
            <p>
              ISP: <span className="text-[#005662]">Comcast Cable Communications, LLC</span>
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-2 my-2">
            <div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" 
                alt="Microsoft Windows" 
                className="w-14 h-14 object-contain" 
              />
            </div>
            <div>
              <img 
                src="/lovable-uploads/40d57122-9014-430f-a2f5-7aeb904ad3fa.png" 
                alt="Microsoft Windows Defender" 
                className="w-14 h-14 object-contain" 
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-700 mt-2">
            Your personal data, banking information and web login credentials saved on this PC are at risk due to a major security breach.
          </div>
          
          <div className="text-xs text-[#00A3EE] mt-2">
            Call Microsoft Windows Support <span className="text-[#00A3EE]">+1-888-809-1260</span> (Helpline)
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-white p-3 text-xs text-gray-700 flex items-center justify-between border-t border-gray-300">
          <div className="flex items-center">
            <div className="mr-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" 
                alt="Microsoft Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="text-black text-base font-bold">
              Microsoft Windows
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              className="bg-[#d83b01] hover:bg-[#c23500] text-white px-5 py-2 text-sm h-auto"
              onClick={() => {
                // Cannot close dialog if preventClose is true
              }}
            >
              Deny
            </Button>
            <Button 
              className="bg-[#005662] hover:bg-[#00464f] text-white px-5 py-2 text-sm h-auto"
              onClick={() => {
                // Cannot close dialog if preventClose is true
              }}
            >
              Allow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityPopup;
