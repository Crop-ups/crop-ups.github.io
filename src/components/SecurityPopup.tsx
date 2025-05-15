
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjIyMmFiZGU1LWFkYWUtNDAzOC04MzQ4LWU4NjFiMjcwMWVlYjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8nPgogIDxwZGY6QXV0aG9yPkNyb3B1cDwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIChSZW5kZXJlcikgZG9jPURBR25STk5wNGZnIHVzZXI9VUFHbWVKSlRybkkgYnJhbmQ9QkFHbWVCajRUdkEgdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/PlXyFowAAB8/SURBVHic7N1/jNx1ncfx93dm9kcXitTUU6iUoFfRCL2LaU70zlMwEk08Q0BN449wapA70NNgLgWNeGqAAJKghBbuYk3wj/OAQg3RGCEtBDla0xgpa6q3KKGEX0ltgdaZnR/f+e4f7Z2/EkK7s/uZ+czj8c/uJJvsa//YPDPfzPf7KaqqqgIAGGm11AMAgIUTdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJCB/AMAgP//7N3tb1b1Hcfx73VDW3pDW1paYFDKjZWMDTNAEiPiTaaZOtzMpsn2xJlNfaBzuqdmbjqnM5hlyRK3uAzd3DTxZmMPhjANmm1yo9Aq2lYESym9sZT2olevs0cjMEppe53r+p7f9/t+/QWfJ7/v57zz+52zKHRMifGzhdM8++j18x879MW539qwe1uGDb8xBbcZa4U/+UyyZ6yoLczNHVy4E7+jYvyMX3jHgR93GhR0JlV5wxPlJx7+uZll5jw1XR0nvvyLct/ffiNfdcfxPx9PSUFnUgwW3fKmX31dDud/U+cRwzm93x8LA+9NSUFnUp3e8t/j3hq/XR0XZf0rWOGzX0w5/OKk73cKFHQmzeWN/3z86bHTvZ5DauzFh/+UHj1whQkuFHQmRfFT758ZPfLQ2LnX+FUfzuUj/yp3/8uG1HNgwoKOCRvvnii7fv1o6+LejZ0H/28sW9ctuzqOff5LqVeBJwQdEzby8obi+LPPTL0jr6TeMu2KNwbyxr0Pl1a8sZx6CvyPoCOpUz9/sLjh128VL3y0rvbxR28sbn7gubTvxADPIOhIqnzlYNnxu/vLuXzplZP3N+VtqXZMhqAjudEtz1S7v/jl1DOmvdGtW1Nv4DYm6GNx4cWqFu/wYJIUu3aonQYJOlM73jlR9oRTr+rqhcFqPPUEbluCzpQa3vx0dezx36aeMeMcf+q31b7N/069gtuUoDNlBtvnTlZvr//r1DNmrH1PPF69vv7+1DO4DQk6U2L9jvWdG9999dDFD9950Dh5OvWkGWfw4KHqxOu7qtT3c2TmEXQm3ZY9Wzop5kwDnbI68cTjqVcwAwk6k2bDW8s7VbE39QymWGfvvmrD222pZzDDCDqTYsOudZ3RfAdWOng49YQZr9r7Rup2C5gWBJ0Jt+HNZztVsS/1DJJpzRZM0Kkyga5NbduW/nP9R6lnkNDIjl3VxwefSz2DGULQmTDrauu6Q+Nm9rTA2k8WQ2IPi4EEeWaztn5rd2jUzG4ree3I/mp9bWnqGQhOYFbWrtvSHTJ27IROHY2hmIToRMLAfGVxZV1V7E49g+mhKg4XizfVUs+g5GEhRO6YnuOzASf5f2KadJPYN2Fw4SdhP1TBydhIuTPNtP4okRAu2qfYksfUelFXm8TGVHLCJzbJeTK+f5vkV3Gi1i6KOlNx0lzMhIFpg+BUS+x5H7lDNMJfsNj7ube+HKKENrEvRPTqzUgf7dbXlnSr8lTqGcwA1VS8MQSdnQv8QEldy6afmF5CvyIV5324Q9Qix165jgvXSfy0pbhDdzNRyCb0aRt56Uf1ZnoigRGb2C9YdARii91GW91YTj2DGaKqimOxDVPZ+BPas8lkI3R6x842tNUYEDs57xGNOo9btKLlOy2kuBKlxfZ04n8kKn7QiR687HEm4h2iER0shnBunwR70Z1VLD8DEzstIh3WRMZ9nCOIT+xpHhud+MkZeprNTnASCQUEJxO7TU5EfiUEiX2vaHQdHKH5ohOcXEJPcwTsYbZItcgvdwRODSF+ckvsnDZwQg0wkc8UO1NPXJ+m2GNnIldecLITCXcoAic+aUbh/pBAYgfJQUoY4BPb04l3BQYm9jQPPDfugZPS9YmOZCJXXviXsvbFALF9EJjYJxP5R6KVRRK8REdX8OEUvvt4ss8SFpxoRATb4T/8RCc+sdul8NwYmcijICi4x1MXS1MvgP8Ke3knssfDcgtLnNjbxptIcI9G9/Rwew+sKpbcF5no447QBfqEBOfqCO2T+Jk9chMRu0F4CJxgwM7UoztyeASTKLjAEZpEjtxDe2pwZL0ueHxiHESbJH78p+Iwwz97xDD5iE54co7QqUGw8pIKPt0lewgVxlxdOHaz4L6L36G1sFNqoh5TR9cV73vncfy5JYqumwXeeop/qRIyb9ELnJSfWXCPjdDgE5p8QK3k6hUa+TU9QY+0RKKHmPLCBfbtYP1Yfsu04KQr/sm5Mr4Qt1fsrI8faOGf8jwTnKTDqPh7hRZ4yWaTb4oMu22a5GpRdP2UbvJ/WKbmFQRVyPAyvj+04g/0oH5JP7ngiDEZn/iiGIzkc0vwBBGZ+x77wr3CX35bzSkUfCH1ga5LM6wJvfAIbnQXn2CSB34p/t6BEzOV6JMqnNATSD7Bwo/S4J2iX/gOE13CCL+6nbF7xLbI1HN13HXbYKKRTGghOj6Cj/DTFjE5w8SXBYKJPTqfITZJ8pp2ctdGgbFV/NNJ/Nk0NuFnMfB5Wnznd6KfPTi5iD6Mn1ty54WJHUfhDRgcQcVEBhexoeHmhWC9ITbJd5t0blNC9N8VXuMIJhN9dJ66R2RpL7jjk4v0S+7JJRc7kl/TC20SvU108ZVkcMJTcgivH4QHH2lXh0Zu3NORBdxk4os1eYi/Wz9b+7LJxFd+cBQXR3S5Iri0cVpwpDRJdJvgKVR8hyeX0OUSfAw9cY/oJhPxvWIvXdVtItG9Ej9Ciyd2UbrsRF+fTi2594NPnlzo35nYoIvtFd4r/N7x94reJjjhDDxbOOfVotjiaBec2G0m/iRORGx5JLlJ/E7BKsp1wbs0ktrF75z8Wu/1Ce4Uv01wr+C7FR+67V9OMtHNEtsrts8k4guriWzTOfv62R/u/2BVfP3sD8b2756D535+7tyObVFgkQSPtF4Lf24JJvblx++VfPD7NJP7mZjOIq+PRn7b4CkULKJT5czHze7PHOLC9uralsdbeeYT5+7Z/cRmnTOfOfee7WceFo8Hzl06P+jkNFbW1CJL0NdFtzl/etihKcY92z+3RWcgOLKT3xbIpYnD6MSy84mzL549h/oen/r42dMPnf3Zzu77d597NB9r9Z5TbHe++vipsz9P9XdNJrh7n2o88+d55+xf5J7deDTw8/u77d9//tKtoL97Prn7+3+y8YH7vl999crZ24YezvHzuXDfzmP3f3z7D9r1tbVlFw46uXz0RxseuGfo4dvHPu6pc1vv/Pv37v5Ea93tv9j14z+3vjX84K3V0OjfFnbhP/f+FXtv+c1i6dWBbx56/NZzP/q5Szf/suft9i8+X44cf+zmR34ysDH40DP6+b1n3/++/d0/9f69vWRpdP2VdXs+/8VtxW+2f762Zs3iipWr71m1tvbVtWurW5Yt67Z6eqa4/X13rViz+r76be8TnPZiuxfVypUfuaO25ourv3DL2nWrPrfiw/et6OnpXdGzpGNFxZJOT09P6jkT18vXhppNZoJi1KjaLbZFdzcV9fbS7gW9vbx7QW9f9wKvdNrbl5ct6FhQ9LbbFSP+9yaKdnt0aHCkORo/ho40R4fP/D0yPNocHR5tjg6PjI482Rw9f4yMnH+8bQwPjTaHjz34wOn696sfvbJ2Tf3bzzaPDTaaw2cezaHjzeZQozk8uLXRbB6vN5rNxmCj2Thebww2Gs0njtWbjcZgs9l4/Fi90Wg0m41G/Vi90Wg2msbjjeZg49i3r13q7a3yPta5D4ZrMJvNRvNM1BuNZrNxvNFoDDYGzxxD9fqxRvPEiUazMdhoDtWbg81G43ij0ThebzQHj9Ub9Waj2Ww0m8ePNZqDjcbg8UajUW80TzxRbzaOH280BpvNZuN4o9moDzYazeZgY/B4o9kYbDQagycG638celb/DeXnct9Tp11tPvChp9eU9bOvZfVng57+nm5PT+aXihi7TD427Pvj9VNqRiMi/KTDCQodU1ZVVTUw1DvxZvnoH7x4TbGkx/9QE/XbJ58obt5aT7HnWf/5FXIm3VBVXzH7YvbvKQYGc70pnX7G/jwk6Ey69S8+M7P2EOf0MvL6m6knzDiCzqRqXdhavfXc1tQzmGJjb76VesKMI+hMmg1vrWh/uHd1dyj1EKbcnr3V5l2rUs9ghhF0JsWGN5/taNaZTjp7Uk+YkQSdSbF57//NPvnIHz7xrouj1VZPJ+z1tdOU6Q7W+8Wvcs/ok2UxMGBGN00JOpNix4vjY2OHeI+HG+3Y8WN9vFA3QHYEnUmz782/zTn+5+tdpJtqnbIYWb8h9Qxm8J+BoGNSVVVV7av/YW5v9/WO6aYB0+P2N3dW29e7QYygMyU27/vjrB1Df5199aj3e5hkxfBoMfzcptQzmOEEnSmzdf+/Zh998uF5xciwO/ZJVBX7qs1v/ajaY/6CjinXf+XnQzNnPttPra827zx6stq+0zM7LYSHOFIYGW1Wmy9889rw+F/bUk9hhil++MnDPZcHQ+JuDO9vWzmvt3vV0OXX/jwrpje7zi0+NO/GzBk3O+qm4Tonr52889/qvzxc/3Wfpx0JeMsdU+rTW/46u1pQXjtArKvm3TVr9vJlvUuWZvZbKjPGiYG9O3cOXtl1VcDJ46YAzMx/F6Z+D/1OjVejlwc9xCG51q/ntE0VGBM1jbAJZc5iP3F4BORX0VRaEXQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4Ac/BMAWAK74XXzggAAAABJRU5ErkJggg==" 
                alt="Red Circle" 
                className="w-8 h-8 object-contain"
              />
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjI1MDk5MDIwLWE2YjYtNDIwMC05MjI4LWNhOGU0NzE3NTg3MDwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8nPgogIDxwZGY6QXV0aG9yPkNyb3B1cDwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIChSZW5kZXJlcikgZG9jPURBR25STk5wNGZnIHVzZXI9VUFHbWVKSlRybkkgYnJhbmQ9QkFHbWVCajRUdkEgdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/PjCllMMAACAkSURBVHic7N1fbN3lfcfx7zl24iT28pcmBJKmYJgMDWR4sEgdol1oS1VaVFBFGwQtrGwgrVebilToTau104g6TUiTerGptIG0ETTNgIEmaNclrdtKhZr8wW5jlNgE7JAYO7GxHTu2z9lNVvWPhIhj5znnOa/XzTl35+ML663z0+93nkK5XC4HAFDViqkHAADnTtABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJABQQeADAg6AGRA0AEgA4IOABkQdADIgKADQAYEHQAyIOgAkAFBB4AMCDoAZEDQASADgg4AGRB0AMiAoANABgQdADIg6ACQAUEHgAwIOgBkQNABIAOCDgAZEHQAyICgA0AGBB0AMiDoAJCB/wPgv+KmW2tPqAAAAABJRU5ErkJggg==" 
                alt="Yellow Circle" 
                className="w-8 h-8 object-contain"
              />
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjI5ZmNmOTJkLWMxZGYtNGUxYS1iZThhLTgyZGZhYjM3MjIzNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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" 
                alt="Blue Circle" 
                className="w-8 h-8 object-contain"
              />
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEtWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA1LTEyPC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjI5ZmNmOTJkLWMxZGYtNGUxYS1iZThhLTgyZGZhYjM3MjIzNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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" 
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
