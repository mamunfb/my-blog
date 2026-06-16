CREATE TABLE `languageAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`language` varchar(10) NOT NULL,
	`postId` int,
	`viewCount` int NOT NULL DEFAULT 1,
	`timeSpent` int NOT NULL DEFAULT 0,
	`eventType` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `languageAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `languageAnalytics` ADD CONSTRAINT `languageAnalytics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `languageAnalytics` ADD CONSTRAINT `languageAnalytics_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;