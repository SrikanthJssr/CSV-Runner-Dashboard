"use client";
import { useRef, useState } from "react";
import Papa from "papaparse";

type Props = {
  onChunk: (rows: any[]) => void;
  onStart: () => void;
  onComplete: () => void;
  onError: (msg: string) => void;
};

export default function UploadCSV({ onChunk, onStart, onComplete, onError }: Props) {
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const abortControllerRef = useRef<{ abort: () => void } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset
    setProgressPercent(0);
    onStart();

    let rowsBuffer: any[] = [];
    const chunkSize = 500; // send chunks of 500 rows

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true, // use worker for performance
      step: (result, parser) => {
        // Validate row header presence once
        if (!result || !result.meta || !result.meta.fields) {
          // continue
        }

        rowsBuffer.push(result.data);
        if (rowsBuffer.length >= chunkSize) {
          onChunk(rowsBuffer.splice(0, rowsBuffer.length));
        }
        // update progress estimate (approx)
        if (file.size && result.meta) {
          const processedBytes = (result.meta.cursor as number) ?? 0;
          const percent = Math.min(99, Math.round((processedBytes / file.size) * 100));
          setProgressPercent(percent);
        }
      },
      complete: (results) => {
        // flush buffer
        if (rowsBuffer.length) onChunk(rowsBuffer.splice(0, rowsBuffer.length));

        // final header check
        if (!results || !results.meta || !results.meta.fields) {
          onError("Invalid CSV: missing headers.");
          return;
        }

        const headers = results.meta.fields.map((f) => String(f).trim().toLowerCase());
        const required = ["date", "person", "miles run"];
        const missing = required.filter((r) => !headers.includes(r));
        if (missing.length) {
          onError(`❌ Missing headers: ${missing.join(", ")}`);
          return;
        }

        setProgressPercent(100);
        onComplete();
        setTimeout(() => setProgressPercent(null), 600);
      },
      error: (err) => {
        onError(`Parsing error: ${err.message}`);
      },
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Upload CSV</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="block w-full text-sm text-zinc-700 dark:text-zinc-300 mb-3"
        aria-label="Upload CSV file"
      />
      {progressPercent !== null && (
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-3 bg-foreground transition-all"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        File must contain headers: <code>date, person, miles run</code>. Large files supported via streaming.
      </p>
    </div>
  );
}
