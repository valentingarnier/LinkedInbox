-- Add analysis progress tracking to analytics_summary
ALTER TABLE analytics_summary
ADD COLUMN IF NOT EXISTS analysis_stage TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS analysis_progress INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS analysis_total INTEGER DEFAULT NULL;

COMMENT ON COLUMN analytics_summary.analysis_stage IS 'Current stage of analysis: preparing, computing_metrics, classifying_outreach, analyzing_prospects, computing_global, complete';
COMMENT ON COLUMN analytics_summary.analysis_progress IS 'Current progress count within the stage';
COMMENT ON COLUMN analytics_summary.analysis_total IS 'Total items to process in current stage';
