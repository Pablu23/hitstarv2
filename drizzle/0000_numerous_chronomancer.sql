CREATE TABLE `lobbys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`host_email` text,
	FOREIGN KEY (`host_email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`user_email` text,
	FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_states` (
	`id` text PRIMARY KEY NOT NULL,
	`code_verifier` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_in_lobby` (
	`user_email` text NOT NULL,
	`lobby_id` integer NOT NULL,
	PRIMARY KEY(`user_email`, `lobby_id`),
	FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lobby_id`) REFERENCES `lobbys`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text PRIMARY KEY NOT NULL,
	`username` text
);
