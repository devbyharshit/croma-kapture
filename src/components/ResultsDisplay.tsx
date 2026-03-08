import React from "react";
import type { FilteredResults } from "../types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";

interface ResultsDisplayProps {
  results: FilteredResults;
  onDownload: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  onDownload,
}) => {
  const { nonFSList, fsCromaList, fsOtherList } = results;
  const totalEntries = nonFSList.length + fsCromaList.length + fsOtherList.length;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="text-center bg-card/40 backdrop-blur-md rounded-2xl py-8 px-4 border border-border/50 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight relative z-10">
          Processing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Results</span>
        </h2>
        <p className="text-lg text-muted-foreground relative z-10 font-medium">
          Total entries extracted: <span className="font-bold text-primary px-3 py-1 ml-1 rounded-md bg-primary/10 shadow-sm border border-primary/20">{totalEntries}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Non-FS Entries",
            count: nonFSList.length,
            desc: "FS Flag = \"Non FS\" & Case Ageing ≥ 7",
            delay: "delay-100"
          },
          {
            title: "FS Croma Entries",
            count: fsCromaList.length,
            desc: "FS entries with \"Croma\" in Order Product & Case Ageing ≥ 10",
            delay: "delay-200"
          },
          {
            title: "FS Other Entries",
            count: fsOtherList.length,
            desc: "FS entries without \"Croma\" in Order Product & Case Ageing ≥ 10",
            delay: "delay-300"
          }
        ].map((stat, idx) => (
          <Card key={idx} className={`border-t-4 border-t-primary border-x-border/50 border-b-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 bg-card/60 backdrop-blur-sm relative overflow-hidden group animate-in slide-in-from-bottom-8 fade-in fill-mode-both ${stat.delay}`}>
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 transform pointer-events-none">
              <FileSpreadsheet className="w-32 h-32" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="flex items-center gap-3 text-primary font-semibold text-lg">
                <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500 shadow-sm border border-primary/20 group-hover:border-transparent">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 mt-2">
              <div className="flex items-baseline gap-1 mb-4">
                <p className="text-6xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors duration-500">
                  {stat.count}
                </p>
                <span className="text-sm font-semibold text-muted-foreground ml-1 uppercase tracking-wider">items</span>
              </div>
              <CardDescription className="text-sm font-medium leading-relaxed bg-muted/60 p-3 rounded-lg border border-border/80 shadow-inner">
                {stat.desc}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Download Results
          </CardTitle>
          <CardDescription className="text-base">
            Export all filtered results strictly conforming to formatting standards
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row gap-6 items-center relative z-10">
          <Button
            onClick={onDownload}
            disabled={totalEntries === 0}
            size="lg"
            className="w-full sm:w-auto shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 text-base font-semibold px-8 group/btn"
          >
            <Download className="mr-2 h-5 w-5 group-hover/btn:animate-bounce" style={{ animationDuration: '2s' }} />
            Download All Results
          </Button>
          <div className="flex flex-col items-center sm:items-start pl-0 sm:pl-4 sm:border-l border-border/60">
            <p className="text-sm font-semibold text-foreground">
              4 files generated securely
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Individual category files + combined results
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsDisplay;