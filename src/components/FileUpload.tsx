"use client";

import { useCallback, useState } from "react";
import { MessagesData } from "@/types/linkedin";
import { parseLinkedInMessages } from "@/lib/parseMessages";
import { Spinner } from "@/components/ui";

interface FileUploadProps {
  onDataLoaded: (data: MessagesData) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const content = await file.text();
        const data = parseLinkedInMessages(content);

        if (data.conversations.length === 0) {
          setError("No messages found. Make sure you uploaded the correct LinkedIn messages export file.");
          return;
        }

        onDataLoaded(data);
      } catch {
        setError("Failed to parse the file. Please check the format.");
      } finally {
        setIsLoading(false);
      }
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const loadSampleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/sample-messages.csv");
      const content = await response.text();
      const data = parseLinkedInMessages(content);
      onDataLoaded(data);
    } catch {
      setError("Failed to load sample data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
          ${isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
          }
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-zinc-500">Processing messages...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium text-zinc-700">
                Drop your messages.csv here
              </p>
              <p className="text-sm text-zinc-400 mt-1">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
      )}

      <div className="mt-8 p-5 bg-zinc-50 rounded-xl">
        <p className="text-sm font-medium text-zinc-700 mb-3">
          How to export your LinkedIn messages:
        </p>
        <ol className="text-sm text-zinc-500 space-y-2">
          <li className="flex gap-2">
            <span className="text-zinc-400">1.</span>
            <span>Go to LinkedIn → Settings → Data Privacy → Get a copy of your data</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-400">2.</span>
            <span>Select &quot;Messages&quot; and request your archive</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-400">3.</span>
            <span>Download the ZIP, extract it, and upload <code className="bg-zinc-200 px-1.5 py-0.5 rounded text-xs">messages.csv</code></span>
          </li>
        </ol>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={loadSampleData}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          Try with sample data →
        </button>
      </div>
    </div>
  );
}
