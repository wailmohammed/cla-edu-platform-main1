CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text,
	`status` enum('open','closed','escalated') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`closedAt` timestamp,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerifyTokenHash` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerifyExpires` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `resetPasswordTokenHash` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `resetPasswordExpires` timestamp;