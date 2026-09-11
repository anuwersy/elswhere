CREATE TABLE `radar_jobs` (
	`user_id` text NOT NULL,
	`job_id` text NOT NULL,
	`normalized_url` text NOT NULL,
	`body` text NOT NULL,
	`seen_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `job_id`)
);
--> statement-breakpoint
CREATE TABLE `radar_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`started_at` text NOT NULL,
	`finished_at` text,
	`status` text NOT NULL,
	`message` text NOT NULL,
	`result_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `radar_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`updated_at` text NOT NULL
);
