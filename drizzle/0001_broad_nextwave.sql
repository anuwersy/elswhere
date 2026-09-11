CREATE UNIQUE INDEX `idx_radar_jobs_user_url` ON `radar_jobs` (`user_id`,`normalized_url`);--> statement-breakpoint
CREATE INDEX `idx_radar_runs_user_started` ON `radar_runs` (`user_id`,`started_at`);