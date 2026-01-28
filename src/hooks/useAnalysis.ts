"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type AnalysisStage = 
  | "preparing"
  | "computing_metrics"
  | "classifying_outreach"
  | "analyzing_prospects"
  | "computing_global"
  | "analyzing_templates"
  | "complete"
  | null;

export const STAGE_LABELS: Record<NonNullable<AnalysisStage>, string> = {
  preparing: "Preparing conversations...",
  computing_metrics: "Computing engagement metrics...",
  classifying_outreach: "Identifying cold outreach conversations...",
  analyzing_prospects: "Analyzing prospect status & outreach quality...",
  computing_global: "Computing global analytics...",
  analyzing_templates: "Analyzing message templates...",
  complete: "Analysis complete",
};

export interface AnalysisStatus {
  total: number;
  pending: number;
  pendingLimited: number; // Limited to free tier
  analyzing: number;
  completed: number;
  failed: number;
  isComplete: boolean;
  error?: string;
  // Progress tracking
  stage: AnalysisStage;
  stageLabel: string | null;
  progress: number | null;
  progressTotal: number | null;
  isOverLimit: boolean;
}

interface UseAnalysisOptions {
  userId: string;
  onComplete?: () => void;
  onStart?: () => void; // Called after analysis starts and conversations are marked as "analyzing"
  pollingInterval?: number;
}

export function useAnalysis({ userId, onComplete, onStart, pollingInterval = 3000 }: UseAnalysisOptions) {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid dependency loops
  const isAnalyzingRef = useRef(isAnalyzing);
  const onCompleteRef = useRef(onComplete);
  const onStartRef = useRef(onStart);
  
  // Keep refs in sync
  useEffect(() => {
    isAnalyzingRef.current = isAnalyzing;
  }, [isAnalyzing]);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

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
      // Complete when either isComplete is true OR stage is "complete"
      const analysisFinished = data.isComplete || data.stage === "complete";
      if (analysisFinished && isAnalyzingRef.current) {
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
    console.log("[Analysis] Starting analysis...");
    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("[Analysis] Calling POST /api/analyze");
      const response = await fetch("/api/analyze", {
        method: "POST",
        credentials: "include",
      });
      console.log("[Analysis] Response status:", response.status);

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

      // Notify that analysis has started - conversations are now marked as "analyzing"
      onStartRef.current?.();

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
