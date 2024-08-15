-- trade_data.trade_money_total definition
CREATE TABLE `trade_money_total` (
    `id` int NOT NULL AUTO_INCREMENT,
    `total` varchar(255) DEFAULT NULL,
    `date` int DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;