CREATE TABLE `cv_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`version` integer NOT NULL,
	`text` text NOT NULL,
	`content_hash` text NOT NULL,
	`filename` text,
	`mime_type` text,
	`size` integer,
	`status` text NOT NULL,
	`analysis` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cv_versions_user_version` ON `cv_versions` (`user_id`,`version`);--> statement-breakpoint
CREATE INDEX `idx_cv_versions_user_created` ON `cv_versions` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `fit_analysis_cache` (
	`user_id` text NOT NULL,
	`cv_version` integer NOT NULL,
	`content_hash` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `cv_version`, `content_hash`)
);
--> statement-breakpoint
CREATE TABLE `radar_guards` (
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`window_started_at` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`locked_until` text,
	PRIMARY KEY(`user_id`, `kind`)
);
--> statement-breakpoint
ALTER TABLE `radar_settings` ADD `revision` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `radar_settings` ADD `mutation_token` text DEFAULT '' NOT NULL;