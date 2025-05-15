
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
      <DialogContent className="p-0 border-0 max-w-xl gap-0" closeButton={!preventClose}>
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
          
          <div className="flex justify-center items-center gap-2 my-2">
            <div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" 
                alt="Microsoft Windows" 
                className="w-14 h-14 object-contain" 
              />
            </div>
            <div className="flex gap-2">
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjIyMmFiZGU1LWFkYWUtNDAzOC04MzQ4LWU4NjFiMjcwMWVlYjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8nPgogIDxwZGY6QXV0aG9yPkNyb3B1cDwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIChSZW5kZXJlcikgZG9jPURBR25STk5wNGZnIHVzZXI9VUFHbWVKSlRybkkgYnJhbmQ9QkFHbWVCajRUdkEgdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/PlXyFowAAB8/SURBVHic7N1/jNx1ncfx93dm9kcXitTUU6iUoFfRCL2LaU70zlMwEk08Q0BN449wapA70NNgLgWNeGqAAJKghBbuYk3wj/OAQg3RGCEtBDla0xgpa6q3KKGEX0ltgdaZnR/f+e4f7Z2/EkK7s/uZ+czj8c/uJJvsa//YPDPfzPf7KaqqqgIAGGm11AMAgIUTdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASAD/wEAu+fdww4FIQAAAABJRU5ErkJggg==" 
                alt="Red Circle" 
                className="w-8 h-8 object-contain"
              />
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjI1MDk5MDIwLWE2YjYtNDIwMC05MjI4LWNhOGU0NzE3NTg3MDwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8nPgogIDxwZGY6QXV0aG9yPkNyb3B1cDwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIChSZW5kZXJlcikgZG9jPURBR25STk5wNGZnIHVzZXI9VUFHbWVKSlRybkkgYnJhbmQ9QkFHbWVCajRUdkEgdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/PjCllMMAACAkSURBVHic7N1fbN3lfcfx7zl24iT28pcmBJKmYJgMDWR4sEgdol1oS1VaVFBFGwQtrGwgrVebilToTau104g6TUiTerGptIG0ETTNgIEmaNclrdtKhZr8wW5jlNgE7JAYO7GxHTu2z9lNVvWPhIhj5znnOa/XzTl35+ML663z0+93nkK5XC4HAFDViqkHAADnTtABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRB39A+XVxcXCYiIiJi0KBB+QsXLvxXb2/vL3p7e3/e29v7855p06a99dZbz9i/f3/LyJEjGxIR0dvb+9+9vb3/1dPT85fe3t5fnj59+v99XX/99X/97rvvTv32t7/dOGbMmOG6vV5vVW/vb3p7e/+jp6fnF+fOnXurp6fnrT179ix5/PHHIyLimWeeuXbXrl3Txo0bV9/d3f12b2/vv/X09DzX3d295Lzzzptz9dVXt15xxRVjampqBq87deqlM9XV1a/09PT8srv7rcO9vb0RETFixKCIiOjtPXOopqbmzpqamnOvcbTUzB07dn3Vd7/73Z9s2LDhP1esWLH/H/7hH35dX1//f7aydevWnaNHjz517bXXtk+bNm3c8OHDL66urp7d09PT29PT88rp06df6+3t/bl/JgH4y8VSEERERERBUXBBFBRHQbFva//n/V9U+3/un/xvlYN+7vv7P//7X4z/5X9rrj7Qf9nB+j9fz/mk/3V/3v/5X4w/t37Q//5BXwf6P3/Q+2aor4O9Lw/2pdDf9BN99yv0rDzYn+lEVYOEEBERUXhQdFE01P9VKMxXUXjCKAh8FBRXZWFxVQZVUOgoLLBCQJWFRV446KCDxHKwwPpe64XFVBhWQQEOr8v8KiwBFZdX8Qyopgg7hZDehoJQhMihcIaFJVP0uSD2xaVTFFfh9T9AdIuKp6BgCsukqECCIiksiYICKQypsDAKQikuh+JQgqttKCYH21qpQ6VQVBxRNExG0VK4OJXCYgAA+L853hywtyd8a9c/JrZky46iZ6b+dyoRe1QOKvI4isaxlA5E2SiYhRlBZTE53DcGFM2E7ApG0WL4b46vNFyHW2RRPIoWmsN9U3G5FEyoUQQA8H86haSDn0KCD35CcXBVHVZ1UYGcU+iFBXK40w+iajjYKSz2wuJyuJOuYO7NgYrlYOeHm2+UDZpvoVMmAED9YAgAgJADABByAAAgAgAAEHIAAOodAACjBQAAIQcAQMgBABByAABCDgAAhBwAACEHAEDIAQAIOQAAQg4AgJADACDkAAAIOQAAQg4AgJADACDkAACEHAAAIQcAQMgBABByAABCDgCAkAMAIOQAAAg5AABCDgBAyAEAEHIAAIQcAAAhBwAg5AAACDkAAEIOAICQAwAQcgAAhBwAACEHAEDIAQAIOQAAQg4AgJADACDkAACEHAAAIQcAQMgBABByAABCDgCAkAMAIOQAAAg5AABCDgBAyAEAEHIAAIQcAAAhBwAg5AAACDkAAEIOAICQAwAQcgAAhBwAACEHAEDIAQAIOQAAQg4AgJADACDkAACEHAAAIQcAQMgBABByAABCDgCAkAMAIOQAAAg5AABCDgBAyAEAEHIAAIQcAAAhBwAg5AAACDkAAEIOAICQAwAQcgAAhBwAACEHAEDIAQAIOQAAQg4AgJADACDkAACEHAAAIQcAQMgBABByAABCDgAACAsAAA==" 
                alt="Yellow Circle" 
                className="w-8 h-8 object-contain"
              />
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjI5ZmNmOTJkLWMxZGYtNGUxYS1iZThhLTgyZGZhYjM3MjIzNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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eENrTnl5vdrm45LCwMCymDBh44aNGzeOTP6/48c3u6LWHHtbW+sff/zxY4+vqbmpoqLiTtOT3tKlSx8yDEltXrr0pTgjzXpoW10dsz74wCiPKP7oWL9+/ZFv29vb64eGhtb39/fffNFFF02dPn3642Z+vDj3ttueOH3WrBfHnnhixoEYVdLQUGMlznd/vhaHB945vmrVqrl1dXV1czs7L//ud79rEkY6h3v27Kk+ocrOyseECROaluwct25nZ+e1O3fu/JeampqJDQ0N2wydv72v/qv9+88YP35W8ic6//xYmiAKGZ+Fye6Jm6OzZMmSflM1DiwyZs2NiUkf+6Vf/erJloh7HfXHi5KXXnrpwNM33FD2iWnTJttTRfDua6+N3bJ3774uJ6aKqHzyF7+YvHvz5tyPxwvnzh36wOCPi7Hbvn37wW9961tBnlGPnp6eer3I0+eff77uukt847570i8M5eXRNmm0D6mPF13nnnvuuSHoRTZ16tSbxo0bJ+g4ssPhrl2IxnbXavpZraOJDjalpaXFL774YqyJENY8tXvr9saNG599+umnnZ0X9OJbOzu3x9xcfr9z49xzD/ps+jj0/PPPNwt68W176aXtCb9y56F77rmN7wzHoN617791pd5QO3fulHPPraB/bGqvvbY79bos6Pn61JYtcZ1RpdgKNhGPL8OzdRi8m9/Y2Niupvmav337XJfNiu3wO++805LZyWVBH49ebm8f+b14O3Z8OOOcqVMXRpQIep6afe21763NcF1eucAXm2NsYfC6667bqmL5+sUvfrGnLc2lYt8yi+zoXMmfOHFi1alTp/qMFudqoKszUt+/f/fgYPc+O3sc+PqFJ/S8GHLkyJGBgYFYtGhRfPWrXz1JVfN1zpnNj/+ur++DVat27szx7/7pE09MGW/UKbqBgYEPgsKRI0eGI2KrZ8g4qqpefTVaEv7O75w/v3jvG1LUE5aNjY2CXnzFY489tnF8fjd7Fvr6Y25z86gf9/cfnN6xf//7cZK5H7+mTJnyrqDn6dENG/b35zn/lZVPdu7b5yhCscflvhtvvNGfXuWoCrb09va+m+Pf/2drp05952VB5xgcnm9961uVKpavX//619mGcOfWrW8IGif9/f0H3nnnHXEDOF4N9PZGVebv2a0TdI6Fheett95qSLzLC3Y+/vjj/57rI9XOKQw3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" 
                alt="Green Checkmark" 
                className="w-8 h-8 object-contain"
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
