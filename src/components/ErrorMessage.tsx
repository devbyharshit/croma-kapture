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
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
      <Alert variant="destructive" className="relative bg-destructive/5 backdrop-blur-md border border-destructive/20 shadow-lg shadow-destructive/10 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2 bg-destructive/10 rounded-full shrink-0">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 my-auto">
            <AlertTitle className="font-bold text-destructive tracking-tight mb-1">
              Error Processing File
            </AlertTitle>
            <AlertDescription className="text-destructive/90 font-medium">
              {message}
            </AlertDescription>
          </div>
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </Alert>
    </div>
  );
};

export default ErrorMessage;