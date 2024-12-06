-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: charity
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `charity_campaigns`
--

DROP TABLE IF EXISTS `charity_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_campaigns` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `charity_org_id` int unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `distributed_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `goal_amount` decimal(15,2) DEFAULT NULL,
  `current_amount` decimal(15,2) DEFAULT '0.00',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `url` text,
  PRIMARY KEY (`id`),
  KEY `charity_org_id` (`charity_org_id`),
  CONSTRAINT `charity_campaigns_ibfk_1` FOREIGN KEY (`charity_org_id`) REFERENCES `charity_organizations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_campaigns`
--

LOCK TABLES `charity_campaigns` WRITE;
/*!40000 ALTER TABLE `charity_campaigns` DISABLE KEYS */;
INSERT INTO `charity_campaigns` VALUES (7,1,'Ủng Hộ Đồng Bào vùng lũ thiệt hai do bão Yagi','Chung tay cùng ủng hộ đồng bào bị thiệt hại do bão Yagi.\nBão Yagi (tên gọi ở Philippines là Bão Enteng - tiếng Anh: Severe Tropical Storm Enteng, nguyên văn \'Bão nhiệt đới dữ dội Enteng\', được Việt Nam định danh là Bão số 3 năm 2024), là xoáy thuận nhiệt đới thứ 11 của Mùa bão Tây Bắc Thái Bình Dương 2024. Cơn bão đã ảnh hưởng tới một loạt các nước châu Á đặc biệt là Philippines, Trung Quốc và Việt Nam. Sau khi suy yếu thành một vùng áp thấp trên khu vực Tây Bắc Bộ của Việt Nam, kết hợp với dải hội tụ nhiệt đới từ phía bắc tràn xuống, một đợt mưa lớn kỷ lục trong vòng 30 năm đã diễn ra, gây ra trận lũ lụt lớn tại miền Bắc Việt Nam trong năm 2024.\n\nYagi xuất phát từ một vùng áp thấp hình thành vào ngày 30 tháng 8, cách khoảng 540 km (330 mi) về phía tây bắc của Palau. Vào ngày 1 tháng 9, hệ thống này được phân loại là một cơn bão nhiệt đới và cũng được Cục Khí tượng Nhật Bản đặt tên là bão Yagi. Sau khi đổ bộ vào Casiguran, Aurora vào lúc 13 giờ UTC+8 (06:00 giờ UTC) ngày 2 tháng 9, Yagi suy yếu khi di chuyển vào đất liền ở Luzon. Sau đó, nó đi vào Biển Đông và bắt đầu hợp nhất với một hệ thống tuần hoàn phụ ở phía tây vịnh Lingayen, khi đó các vùng đối lưu sâu bắt đầu xoáy và phát triển các dải mây đối lưu kéo dài về phía tây và phía nam. Vào ngày 5 tháng 9, Trung tâm Cảnh báo Bão Liên hợp đã tăng cấp Yagi lên thành siêu bão; tuy nhiên, sau đó Yagi suy yếu do trải qua quá trình thay thế mắt bão. Cuối ngày hôm đó, Yagi đã quay trở lại trạng thái siêu bão sau khi hoàn thành chu kỳ.\n\nTrong công tác chuẩn bị ứng phó với Bão Yagi, các trường học trên toàn tỉnh Hải Nam đã đóng cửa vào ngày 5 tháng 9, các hoạt động giao thông vận tải và vận chuyển địa phương bị đình chỉ vào một ngày sau đó. Tại Philippines, kết hợp giữa Yagi và gió mùa tây nam đã gây ra mưa lớn ở các khu vực phía bắc và nam của Luzon, dẫn đến lũ quét trên diện rộng tại nhiều nơi. Đài Khí tượng Hải Nam nhận định Yagi là cơn bão mạnh nhất tấn công đảo kể từ bão Rammasun vào năm 2014; Cục Khí tượng Trung Quốc đánh giá đây là cơn bão mùa thu mạnh nhất và lớn nhất tấn công quốc gia này trong 75 năm qua, kể từ khi nước này độc lập năm 1949.[1] Trên đất liền Việt Nam, gió thực đo tại Bãi Cháy ghi nhận là cấp 14 giật trên cấp 17, được đánh giá là cơn bão mạnh nhất đổ bộ vào đất liền Việt Nam trong 70 năm qua tại Hội nghị Thường trực Chính phủ ngày 15 tháng 9. Cơn bão đã khiến ít nhất 844 người chết, 2.279 người bị thương và 129 người mất tích, dẫn đến tổng thiệt hại 16,6 tỷ USD ở tám quốc gia và vùng lãnh thổ.',0.00,1000000000.00,560000.00,'2024-10-20','2024-12-20','active','2024-12-03 02:51:04','2024-12-03 15:02:28','https://www.google.com/url?sa=i&url=https%3A%2F%2Fvi.wikipedia.org%2Fwiki%2FB%25C3%25A3o_Yagi_%25282024%2529&psig=AOvVaw2kQ0DC8atRcBUPVPkqjAP6&ust=1733508736521000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOD-x7WdkYoDFQAAAAAdAAAAABAJ'),(8,4,'Ủng Hộ Đồng Bào vùng lũ thiệt hai do bão Molave','Chung tay cùng ủng hộ đồng bào bị thiệt hại do bão Molave',0.00,500000000.00,0.00,'2020-07-03','2020-09-03','completed','2024-12-03 03:10:26','2024-12-03 04:37:10','https://www.google.com/url?sa=i&url=https%3A%2F%2Fvi.wikipedia.org%2Fwiki%2FB%25C3%25A3o_Yagi_%25282024%2529&psig=AOvVaw2kQ0DC8atRcBUPVPkqjAP6&ust=1733508736521000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOD-x7WdkYoDFQAAAAAdAAAAABAJ'),(17,5,'Bão số 2','Bão Prapiroon (tên tiếng Anh đầy đủ: Severe Tropical Storm Prapiroon [bão nhiệt đới dữ dội Prapiroon], Việt Nam gọi là bão số 2 năm 2024) là một cơn bão nhiệt đới đổ bộ vào Hải Nam và miền Bắc Việt Nam vào tháng 7 năm 2024.',0.00,15000000.00,0.00,'2024-12-02','2024-12-06','active','2024-12-03 14:51:50','2024-12-03 14:53:43',NULL);
/*!40000 ALTER TABLE `charity_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charity_organizations`
--

DROP TABLE IF EXISTS `charity_organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_organizations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(20) NOT NULL,
  `organization_name` varchar(255) NOT NULL,
  `license_document` varchar(255) NOT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  CONSTRAINT `charity_organizations_ibfk_1` FOREIGN KEY (`phone_number`) REFERENCES `users` (`phone_number`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_organizations`
--

LOCK TABLES `charity_organizations` WRITE;
/*!40000 ALTER TABLE `charity_organizations` DISABLE KEYS */;
INSERT INTO `charity_organizations` VALUES (1,'0123456782','Chống bão Yagi','123456FFFF333DD',1,'2024-11-16 01:58:06','2024-12-02 05:53:17'),(2,'0258741963','Chống bão Trami','123456FFFF333FF',0,'2024-11-16 02:34:36','2024-11-16 02:34:53'),(3,'0123658974','Chống bão Cơn bão số 3','180ABBB8953210FF',0,'2024-12-03 03:02:01','2024-12-03 03:02:01'),(4,'0324561789','Chống bão Molave','12346XYDFF333FF',1,'2024-12-03 03:05:07','2024-12-03 03:05:34'),(5,'032569874','Chống bão số 2','123456FRFF333FF',1,'2024-12-03 14:39:47','2024-12-03 14:40:30');
/*!40000 ALTER TABLE `charity_organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `donor_id` int unsigned NOT NULL,
  `campaign_id` int unsigned NOT NULL,
  `location_id` int unsigned DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `method` varchar(50) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `campaign_id` (`campaign_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `donations_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `charity_campaigns` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `donations_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (11,1,7,4,15000.00,'cash',NULL,'pending','2024-12-03 12:57:20','2024-12-03 12:57:20'),(12,5,7,4,25000.00,'bank',NULL,'pending','2024-12-03 14:57:58','2024-12-03 14:57:58'),(13,5,7,4,500000.00,'bank',NULL,'completed','2024-12-03 15:00:28','2024-12-03 15:01:16'),(14,5,7,4,20000.00,'bank',NULL,'pending','2024-12-03 15:02:28','2024-12-03 15:02:28');
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text,
  `date` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `charity_campaigns` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `campaign_id` int unsigned NOT NULL,
  `content` text NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `charity_campaigns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,1,7,'Cũng được',4,'2024-12-03 12:07:01','2024-12-03 12:07:01'),(2,1,7,'OK',4,'2024-12-03 12:07:50','2024-12-03 12:07:50'),(3,1,7,'Đây là bình luận của tui nè. Heheheehehe',2,'2024-12-03 12:33:17','2024-12-03 12:33:17'),(4,1,7,'Alo alo',1,'2024-12-03 15:05:18','2024-12-03 15:05:18');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `damage_level` int DEFAULT NULL,
  `needs_help` tinyint(1) DEFAULT '1',
  `ward` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `goal_amount` decimal(15,2) DEFAULT NULL,
  `current_amount` decimal(15,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `charity_campaigns` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (4,7,'Quảng Ninh',21.00638200,107.29251100,1,1,'Bình Dân','Vân Đồn','Quảng Ninh','Quảng Ninh',NULL,0.00,'2024-12-03 02:51:04','2024-12-03 04:42:08'),(5,8,'Quảng Nam',15.53935400,108.01910400,1,1,'Phú Ninh','Bắc Trà My	','Quảng Nam','Quảng Nam',500000000.00,0.00,'2024-12-03 03:10:26','2024-12-03 04:37:10'),(8,17,'Hà Nội',21.02776300,105.83416000,2,1,'Bình Dân','Vân Đồn','Hà Nội','Hà Nội',1000000.00,0.00,'2024-12-03 14:51:50','2024-12-03 14:52:41');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('donor','charity_org','recipient','admin') NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `birth_date` date DEFAULT NULL,
  `additional_approval` enum('NOT_NEEDED','PENDING','APPROVED') DEFAULT 'NOT_NEEDED',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ha','Phan','0123456789','nguyenvanan@gmail.com','$2a$10$YNzMXXdZy78tfVxYWtsDVusWKzVY1DWER0kCNtrKtHx1OTLZ9gsu6','admin',1,'1999-03-11','NOT_NEEDED','2024-11-16 01:55:10','2024-11-16 01:55:12'),(3,'An','Nguyễn','0123456782','nguyenvanan123@gmail.com','$2a$10$5LyhvDvofZ67YDqWdldf5etcAVc/COS7m9zqe0aVX/sf52E.PI2fW','charity_org',1,'2024-11-22','APPROVED','2024-11-16 01:58:03','2024-12-02 05:53:17'),(4,'Binh','Nguyễn','0258741963','nguyenvanbinh@gmail.com','$2a$10$szTnEx0usPYJW9d3OEByWuCE5i.y..28Yx3cOlHHfH8keOFSs1a02','charity_org',1,'2024-11-08','PENDING','2024-11-16 02:34:33','2024-11-16 02:34:53'),(5,'Cường','Phan','0123659874','cuongphan@gmail.com','$2a$10$i.XDDOqtHfHWPIN5YM55PuJmDj6r2GC.e6YPezNWVQCURrGc1kiby','donor',1,'2000-12-03','NOT_NEEDED','2024-12-03 02:11:10','2024-12-03 02:11:13'),(6,'Duy','Phạm','0387963052','duypham@gmail.com','$2a$10$CVxOGxhdNNDcCioVrARsWed31so7IcZe7xh5IOir8x3MO15pHe9g.','recipient',1,'1999-05-11','NOT_NEEDED','2024-12-03 02:12:10','2024-12-03 02:12:13'),(7,'Hạnh','Nguyễn Thị Hồng','0123658974','nguyenhanh@gmail.com','$2a$10$4B8AqWPMCPvjZwBFKEHlUunPV7hdMiBhT2Om0O2PLEJ.jZpUw9M66','charity_org',1,'1998-07-03','PENDING','2024-12-03 03:01:59','2024-12-03 03:02:01'),(8,'Lan','Phạm','0324561789','phamlan@gmail.com','$2a$10$gnFwnvx7fM/QdW3Arkf4UO/by5sgeAUvoJfmvqrO/BvFElqqZkKrS','charity_org',1,'1985-12-04','APPROVED','2024-12-03 03:05:05','2024-12-03 03:05:34'),(9,'Minh','Nguyễn','012365987','nguyenminh@gmail.com','$2a$10$Jpn7QlwzCQ8oDVS5f./8z.WltKcgialM3K66R6qboV76QBk/KVlBe','admin',1,'1999-12-03','NOT_NEEDED','2024-12-03 14:37:44','2024-12-03 14:37:54'),(10,'Nguyên','Phạm','032569874','NguyenPham@gmail.com','$2a$10$Y09s.9zRSGKbKtjiWPlEhOZXwlmdIJg.foBuxoYxckyFjUJS7eqbO','charity_org',1,'1998-12-04','APPROVED','2024-12-03 14:39:44','2024-12-03 14:40:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-06 20:44:27
