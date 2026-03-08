import { useState, useCallback } from "react";
import FileUpload from "./components/FileUpload";
import ResultsDisplay from "./components/ResultsDisplay";
import ErrorMessage from "./components/ErrorMessage";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { processExcelFile, downloadResults } from "./utils/excelProcessor";
import type { FilteredResults } from "./types";

function App() {
  const [results, setResults] = useState<FilteredResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setResults(null);
    setIsProcessing(true);

    try {
      const processedResults = await processExcelFile(file);
      setResults(processedResults);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error processing file:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (results) {
      try {
        downloadResults(results);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to download results";
        setError(errorMessage);
        console.error("Error downloading results:", err);
      }
    }
  }, [results]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="min-h-screen relative bg-background overflow-hidden flex flex-col items-center selection:bg-primary/20 selection:text-primary">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 inset-x-0 h-[500px] pointer-events-none bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="fixed -top-[30%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse duration-10000" />
      <div className="fixed -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none mix-blend-multiply opacity-50 animate-pulse duration-7000" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 flex-grow flex flex-col mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-16 animate-in slide-in-from-top-8 fade-in duration-700">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Excel Data Automation
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            <span className="text-foreground">Croma Kapture</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-primary/40">
              Processor
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your Excel file to filter and segregate RSM data with precision and elegance
          </p>
        </header>

        <main className="space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150 fill-mode-both w-full">
          <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />

          {error && (
            <ErrorMessage message={error} onDismiss={handleDismissError} />
          )}

          {isProcessing && (
            <Card className="w-full max-w-md mx-auto bg-card/60 backdrop-blur-xl border-border/50 shadow-xl relative overflow-hidden animate-in zoom-in-95 fade-in duration-500">
              <div className="absolute inset-0 bg-primary/5 animate-pulse duration-2000" />
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 relative z-10">
                <Spinner className="size-16 text-primary mb-8 animate-spin" />
                <p className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                  Processing your Excel file...
                </p>
                <p className="text-base text-muted-foreground text-center font-medium">
                  Please wait while we filter and segregate your data
                </p>
              </CardContent>
            </Card>
          )}

          {results && !isProcessing && (
            <ResultsDisplay results={results} onDownload={handleDownload} />
          )}
        </main>

        <footer className="relative z-10 mt-20 text-center text-sm text-muted-foreground border-t border-border/40 pt-8 pb-4 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <p className="transition-colors duration-300">
            made by <a href="https://github.com/devbyharshit" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors hover:underline underline-offset-4">@devbyharshit</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
