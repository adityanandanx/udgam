import { isAxiosError } from "axios";
import { AlertTriangleIcon, CloudAlertIcon } from "lucide-react";
import { toast } from "sonner";

export const handleApiError = (error: unknown) => {
  if (isAxiosError(error)) {
    if (!error.response) {
      toast("Network error. Cannot connect to server", {
        icon: <CloudAlertIcon size={16} className="text-muted-foreground" />,
      });
      throw new Error("Network error. Cannot connect to server");
    }

    const { data } = error.response;
    toast(data.error || "An error occurred", {
      icon: <AlertTriangleIcon size={16} className="text-muted-foreground" />,
    });
    return;

    // if (status === 401) {
    //   throw new Error("Authentication failed. Please check your credentials.");
    // } else if (status === 403) {
    //   throw new Error("You do not have permission to perform this action.");
    // } else if (status === 404) {
    //   throw new Error("Resource not found.");
    // } else if (status >= 500) {
    //   throw new Error("Server error. Please try again later.");
    // } else {
    //   throw new Error(data?.message || "An unknown error occurred.");
    // }
  }
  throw error; // Re-throw non-axios errors
};
