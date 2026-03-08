import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-semibold">Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;