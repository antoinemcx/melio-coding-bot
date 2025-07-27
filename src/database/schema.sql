SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `leveling` (
  `userID` varchar(80) NOT NULL,
  `xp` varchar(100) NOT NULL DEFAULT '0',
  `level` varchar(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `leveling`
  ADD PRIMARY KEY (`userID`);
COMMIT;