CREATE TABLE `responses` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text NOT NULL,
	`role` text NOT NULL,
	`email` text NOT NULL,
	`answers` text NOT NULL,
	`scores` text NOT NULL,
	`dominant` text NOT NULL,
	`created_at` integer NOT NULL
);
