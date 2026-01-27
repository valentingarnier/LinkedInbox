"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface AnalysisStatus {
  total: number;
  pending: number;
  analyzing: number;
  completed: number;
  failed: number;
  isComplete: boolean;
  error?: string;
}

interface UseAnalysisOptions {
  userId: string;
  onComplete?: () => void;
  pollingInterval?: number;
}

export function useAnalysis({ userId, onComplete, pollingInterval = 3000 }: UseAnalysisOptions) {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid dependency loops
  const isAnalyzingRef = useRef(isAnalyzing);
  const onCompleteRef = useRef(onComplete);
  
  // Keep refs in sync
  useEffect(() => {
    isAnalyzingRef.current = isAnalyzing;
  }, [isAnalyzing]);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const fetchStatus = useCallback(async (): Promise<AnalysisStatus | null> => {
    try {
      const response = await fetch("/api/analyze/status", {
        credentials: "include",
      });

      if (!response.ok) {
        setError(`Status check failed: ${response.status}`);
        return null;
      }

      const data: AnalysisStatus = await response.json();
      setStatus(data);
      setError(null);

      // Check completion using ref to avoid stale closure
      if (data.isComplete && isAnalyzingRef.current) {
        setIsAnalyzing(false);
        onCompleteRef.current?.();
      }

      return data;
    } catch (err) {
      setError(String(err));
      return null;
    }
  }, []); // No dependencies - uses refs

  const triggerAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorJson = JSON.parse(text);
          setError(errorJson.error || errorJson.details || "Analysis failed");
        } catch {
          setError(`Analysis failed: ${response.status}`);
        }
        setIsAnalyzing(false);
        return false;
      }

      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setIsAnalyzing(false);
        return false;
      }

      return true;
    } catch (err) {
      setError(String(err));
      setIsAnalyzing(false);
      return false;
    }
  }, []);

  // Polling effect - only runs when isAnalyzing changes
  useEffect(() => {
    if (!isAnalyzing) return;

    // Fetch immediately when analysis starts
    fetchStatus();
    
    const interval = setInterval(fetchStatus, pollingInterval);
    return () => clearInterval(interval);
  }, [isAnalyzing, pollingInterval, fetchStatus]);

  return {
    status,
    isAnalyzing,
    error,
    fetchStatus,
    triggerAnalysis,
    setIsAnalyzing,
  };
}
