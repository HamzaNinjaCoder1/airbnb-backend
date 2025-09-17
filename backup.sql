-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: airbnb_data
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `listing_id` int NOT NULL,
  `guest_id` int NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `guests` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'confirmed',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `FK_4514952fd3af4b4fd051e378859` (`listing_id`),
  KEY `FK_b4403309538387262d97fdf2462` (`guest_id`),
  CONSTRAINT `FK_4514952fd3af4b4fd051e378859` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_b4403309538387262d97fdf2462` FOREIGN KEY (`guest_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (87,64,'2025-10-06','2025-10-11',1,110.00,'confirmed','2025-09-15 03:16:35.805110','2025-09-15 21:20:54.104420',28),(87,65,'2025-10-06','2025-10-11',1,248.00,'confirmed','2025-09-15 17:00:54.636066','2025-09-15 21:20:54.104420',30);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancellationpolicy`
--

DROP TABLE IF EXISTS `cancellationpolicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancellationpolicy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `policy_text` text,
  PRIMARY KEY (`id`),
  KEY `listing_id` (`listing_id`),
  CONSTRAINT `cancellationpolicy_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancellationpolicy`
--

LOCK TABLES `cancellationpolicy` WRITE;
/*!40000 ALTER TABLE `cancellationpolicy` DISABLE KEYS */;
/*!40000 ALTER TABLE `cancellationpolicy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_dfe9b0c3a8e109e992c98f67be6` (`user1_id`),
  KEY `FK_b76eb80f3d89cd3f0f194043b74` (`user2_id`),
  CONSTRAINT `FK_b76eb80f3d89cd3f0f194043b74` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_dfe9b0c3a8e109e992c98f67be6` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (5,64,56,'2025-09-15 03:16:36.019040','2025-09-15 03:16:36.019040'),(6,65,56,'2025-09-15 17:00:54.694407','2025-09-15 17:00:54.694407');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `headings`
--

DROP TABLE IF EXISTS `headings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `headings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading_text` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `headings`
--

LOCK TABLES `headings` WRITE;
/*!40000 ALTER TABLE `headings` DISABLE KEYS */;
INSERT INTO `headings` VALUES (1,'Popular homes in Islamabad','Islamabad'),(4,'Available in Rawalpindi this weekend','Rawalpindi'),(5,'Popular homes in Nathia Gali','Nathia Gali');
/*!40000 ALTER TABLE `headings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `host_details`
--

DROP TABLE IF EXISTS `host_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `host_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `work` varchar(255) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `bio` text,
  `hosting_since` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `host_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `host_details`
--

LOCK TABLES `host_details` WRITE;
/*!40000 ALTER TABLE `host_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `host_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `houserules`
--

DROP TABLE IF EXISTS `houserules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `houserules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `rule_text` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_id` (`listing_id`),
  CONSTRAINT `houserules_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `houserules`
--

LOCK TABLES `houserules` WRITE;
/*!40000 ALTER TABLE `houserules` DISABLE KEYS */;
/*!40000 ALTER TABLE `houserules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_images`
--

DROP TABLE IF EXISTS `listing_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `image_url` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_94041359df3c1b14c4420808d16` (`listing_id`),
  CONSTRAINT `FK_94041359df3c1b14c4420808d16` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_images`
--

LOCK TABLES `listing_images` WRITE;
/*!40000 ALTER TABLE `listing_images` DISABLE KEYS */;
INSERT INTO `listing_images` VALUES (1,1,'https://a0.muscache.com/im/pictures/hosting/Hosting-1204108136330055639/original/a4397bb2-8805-4682-98ce-8640fed0923c.jpeg?im_w=960'),(2,2,'https://a0.muscache.com/im/pictures/hosting/Hosting-1465842288602672487/original/0aa08325-aaa8-4c9c-a068-01d1aeef9867.jpeg?im_w=960'),(3,3,'https://a0.muscache.com/im/pictures/miso/Hosting-1457794944467443431/original/5290e61c-dbb3-4e5e-b4d4-b238787a21ce.jpeg?im_w=960'),(4,4,'https://a0.muscache.com/im/pictures/hosting/Hosting-1304933741466095217/original/ba05d182-d725-412a-aae8-226f7fb50818.jpeg?im_w=960'),(5,5,'https://a0.muscache.com/im/pictures/8faf0783-e210-4f08-a869-e793440f5c97.jpg?im_w=960'),(6,6,'https://a0.muscache.com/im/pictures/hosting/Hosting-975367327288508350/original/04b6a40d-9ace-4207-adce-0bd3f0590754.jpeg?im_w=960'),(7,7,'https://a0.muscache.com/im/pictures/hosting/Hosting-1220003727178463290/original/92741a26-9fb0-4160-82dc-234769d0e77a.jpeg?im_w=960'),(8,8,'https://a0.muscache.com/im/pictures/hosting/Hosting-1101888665347641624/original/de3fc7d7-54fc-4bbf-801b-8534acaddfe0.jpeg?im_w=960'),(9,9,'https://a0.muscache.com/im/pictures/hosting/Hosting-1220003727178463290/original/92741a26-9fb0-4160-82dc-234769d0e77a.jpeg?im_w=960'),(10,10,'https://a0.muscache.com/im/pictures/hosting/Hosting-1114329711347062192/original/6ee00cbc-bee3-4fc3-8837-d5717aa3a3a1.jpeg?im_w=960'),(11,11,'https://a0.muscache.com/im/pictures/miso/Hosting-873045018671865613/original/28176a15-ee4d-416e-8f1b-e1e9eddd0eb6.jpeg?im_w=960'),(12,12,'https://a0.muscache.com/im/pictures/miso/Hosting-1420278332550702526/original/a91b871a-1ac0-498b-a1b7-9b2d5b906b79.jpeg?im_w=960'),(13,13,'https://a0.muscache.com/im/pictures/hosting/Hosting-1406627057201360291/original/05f32445-b317-4181-942e-dab5fc7759ad.jpeg?im_w=960'),(14,14,'https://a0.muscache.com/im/pictures/hosting/Hosting-1454534749108303824/original/eca8a3ec-6b22-4960-9f52-5d52132d1fad.jpeg?im_w=960'),(15,15,'https://a0.muscache.com/im/pictures/hosting/Hosting-1465649440804566012/original/b27e994f-f6fa-46b1-8e34-4d3d3d975c87.jpeg?im_w=960'),(16,16,'https://a0.muscache.com/im/pictures/miso/Hosting-1420278332550702526/original/a91b871a-1ac0-498b-a1b7-9b2d5b906b79.jpeg?im_w=960'),(17,17,'https://a0.muscache.com/im/pictures/hosting/Hosting-1406627057201360291/original/05f32445-b317-4181-942e-dab5fc7759ad.jpeg?im_w=960'),(18,18,'https://a0.muscache.com/im/pictures/hosting/Hosting-1454534749108303824/original/eca8a3ec-6b22-4960-9f52-5d52132d1fad.jpeg?im_w=960'),(19,19,'https://a0.muscache.com/im/pictures/hosting/Hosting-1444923057298616151/original/01002d1c-59e5-48c5-ab83-f6214f0ef3c4.jpeg?im_w=960'),(20,20,'https://a0.muscache.com/im/pictures/miso/Hosting-1257682100579478788/original/b5061198-dd5d-4805-bf91-d983d6459851.jpeg?im_w=960'),(21,21,'https://a0.muscache.com/im/pictures/hosting/Hosting-1353694329077466185/original/9604cba6-b243-4220-a767-5cdb3d9fc375.jpeg?im_w=960'),(22,22,'https://a0.muscache.com/im/pictures/hosting/Hosting-1482523429375386263/original/85ad9819-4bc4-4e4f-91ad-674ac141f953.jpeg?im_w=960'),(23,23,'https://a0.muscache.com/im/pictures/hosting/Hosting-1322465412364790455/original/d9005554-beea-40c5-8c40-97cd2441e770.jpeg?im_w=720'),(24,24,'https://a0.muscache.com/im/pictures/hosting/Hosting-1206679182836385793/original/a6162a1c-fb0a-4ebd-9d91-e593b2ae3679.jpeg?im_w=960'),(25,25,'https://a0.muscache.com/im/pictures/hosting/Hosting-1239974531504249140/original/fba8dfa2-11ff-462d-a6a5-2d59041f4d4a.jpeg?im_w=960'),(26,26,'https://a0.muscache.com/im/pictures/hosting/Hosting-1418011150763324138/original/3b7d9410-4d02-48fc-8902-731b0b4b23bd.jpeg?im_w=960'),(27,27,'https://a0.muscache.com/im/pictures/hosting/Hosting-1442868046206380941/original/a03af54c-a3b1-4b79-8410-0ec9b3bbd3de.jpeg?im_w=960'),(28,29,'https://a0.muscache.com/im/pictures/30e4ae38-14c3-4aa3-a72a-9d095038afec.jpg?im_w=960'),(29,30,'https://a0.muscache.com/im/pictures/miso/Hosting-1450667676577983289/original/79efd62f-c13c-4ed0-96df-711ec3ef2b5e.jpeg?im_w=960'),(30,31,'https://a0.muscache.com/im/pictures/prohost-api/Hosting-1376676695434161653/original/aed96b30-c221-45f7-a90d-0659247e7b71.jpeg?im_w=960'),(31,32,'https://a0.muscache.com/im/pictures/prohost-api/Hosting-1331676181043014310/original/87cd394f-6c01-471c-b1f3-ffb38b04e9f6.jpeg?im_w=960'),(32,33,'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM5OTkzODExNTkxNDUwMjI2OQ==/original/a8bd5aca-33dd-4f4f-ab9e-cd5f4f251a86.jpeg?im_w=960'),(33,34,'https://a0.muscache.com/im/pictures/30e4ae38-14c3-4aa3-a72a-9d095038afec.jpg?im_w=960'),(34,35,'https://a0.muscache.com/im/pictures/miso/Hosting-1450667676577983289/original/79efd62f-c13c-4ed0-96df-711ec3ef2b5e.jpeg?im_w=960'),(35,36,'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM2Mzg5Mzg4OTM2MTg2NjcxNw==/original/b5b98bf3-790a-4522-b5df-93a468982f72.jpeg?im_w=960'),(36,37,'https://a0.muscache.com/im/pictures/miso/Hosting-1420051962970743439/original/a60cc8f3-5f4f-4e85-a535-d10d82b66459.jpeg?im_w=960'),(37,38,'https://a0.muscache.com/im/pictures/prohost-api/Hosting-1402216013720138281/original/cd51991b-a97a-4ad4-8f80-f9af6b475995.jpeg?im_w=960'),(233,87,'1757427833928.jpg'),(234,87,'1757427833933.jpg'),(235,87,'1757427833935.jpg'),(236,87,'1757427833942.jpg'),(237,87,'1757427833948.jpg'),(243,101,'1758032217244.jpg'),(244,101,'1758032217256.jpg'),(245,101,'1758032217265.jpg'),(246,101,'1758032217268.jpg'),(247,101,'1758032217269.jpg'),(248,102,'1758032659439.jpg'),(249,102,'1758032659453.jpg'),(250,102,'1758032659454.jpg'),(251,102,'1758032659456.jpg'),(252,102,'1758032659467.jpg'),(253,103,'1758033163440.jpg'),(254,103,'1758033163454.jpg'),(255,103,'1758033163461.jpg'),(256,103,'1758033163462.jpg'),(257,103,'1758033163463.jpg'),(258,104,'1758033575990.jpg'),(259,104,'1758033575995.jpg'),(260,104,'1758033575996.jpg'),(261,104,'1758033576000.jpg'),(262,104,'1758033576001.jpg'),(263,105,'1758033900968.jpg'),(264,105,'1758033900968.jpg'),(265,105,'1758033900977.jpg'),(266,105,'1758033900980.jpg'),(267,105,'1758033900982.jpg'),(268,106,'1758034920924.jpg'),(269,106,'1758034920925.jpg'),(270,106,'1758034920947.jpg'),(271,106,'1758034920948.jpg'),(272,106,'1758034920951.jpg'),(273,107,'1758037303394.jpg'),(274,107,'1758037303406.jpg'),(275,107,'1758037303410.jpg'),(276,107,'1758037303414.jpg'),(277,107,'1758037303416.jpg'),(278,108,'1758037939234.jpg'),(279,108,'1758037939235.jpg'),(280,108,'1758037939240.jpg'),(281,108,'1758037939242.jpg'),(282,108,'1758037939247.jpg');
/*!40000 ALTER TABLE `listing_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `host_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `max_guests` int DEFAULT NULL,
  `bedrooms` int DEFAULT NULL,
  `beds` int DEFAULT NULL,
  `baths` int DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `reviews_count` int DEFAULT NULL,
  `map_url` text,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `stay_type` text,
  `property_type` text,
  `status` text,
  `current_step` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (1,4,'Apartment in Islamabad',NULL,NULL,40.55,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:27:32.059142','',NULL,NULL,''),(2,5,'Condo in Islamabad',NULL,NULL,48.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:34:36.762685','',NULL,NULL,''),(3,6,'Home in Islamabad',NULL,NULL,130.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:35:50.812770','',NULL,NULL,''),(4,4,'Apartment in Islamabad',NULL,NULL,85.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:37:00.212816','',NULL,NULL,''),(5,5,'Condo in Islamabad',NULL,NULL,65.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:37:16.597832','',NULL,NULL,''),(6,6,'Home in Islamabad',NULL,NULL,100.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:37:29.627793','',NULL,NULL,''),(7,7,'Apartment in Islamabad',NULL,NULL,50.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:37:50.658434','',NULL,NULL,''),(8,8,'Condo in Islamabad',NULL,NULL,70.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:38:14.984154','',NULL,NULL,''),(9,9,'Home in Islamabad',NULL,NULL,60.00,'Islamabad',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:38:26.221608','',NULL,NULL,''),(10,10,'Apartment in Rawalpindi',NULL,NULL,53.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:39:29.059442','',NULL,NULL,''),(11,11,'Condo in Rawalpindi',NULL,NULL,53.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:39:44.582880','',NULL,NULL,''),(12,12,'Home in Rawalpindi',NULL,NULL,68.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:40:12.633610','',NULL,NULL,''),(13,13,'Apartment in Rawalpindi',NULL,NULL,75.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:40:34.306228','',NULL,NULL,''),(14,14,'Condo in Rawalpindi',NULL,NULL,48.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:40:59.100410','',NULL,NULL,''),(15,15,'Home in Rawalpindi',NULL,NULL,66.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:41:23.744646','',NULL,NULL,''),(16,16,'Apartment in Rawalpindi',NULL,NULL,68.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:41:52.897847','',NULL,NULL,''),(17,17,'Condo in Rawalpindi',NULL,NULL,77.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:42:14.647769','',NULL,NULL,''),(18,18,'Home in Rawalpindi',NULL,NULL,87.00,'Rawalpindi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 12:42:33.134944','',NULL,NULL,''),(19,19,'Condo in Nathia Gali',NULL,NULL,74.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:29:44.174549','',NULL,NULL,''),(20,20,'Apartemnt in Nathia Gali',NULL,NULL,83.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:30:16.206070','',NULL,NULL,''),(21,20,'Home in Nathia Gali',NULL,NULL,63.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:30:35.677830','',NULL,NULL,''),(22,21,'Condo in Nathia Gali',NULL,NULL,103.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:33:34.780537','',NULL,NULL,''),(23,22,'Home in Nathia Gali',NULL,NULL,94.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:33:53.801159','',NULL,NULL,''),(24,23,'Apartment in Nathia Gali',NULL,NULL,88.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:34:26.895369','',NULL,NULL,''),(25,24,'Apartment in Nathia Gali',NULL,NULL,64.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:34:46.153121','',NULL,NULL,''),(26,24,'Condo in Nathia Gali',NULL,NULL,79.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:35:12.340969','',NULL,NULL,''),(27,25,'Apartment in Nathia Gali',NULL,NULL,81.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:35:50.113315','',NULL,NULL,''),(28,26,'Home in Nathia Gali',NULL,NULL,62.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:36:08.765056','',NULL,NULL,''),(29,27,'Condo in Nathia Gali',NULL,NULL,77.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:36:34.901838','',NULL,NULL,''),(30,28,'Home in Nathia Gali',NULL,NULL,92.00,'Nathia Gali',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:36:55.707556','',NULL,NULL,''),(31,29,'Apartment in Dubai',NULL,NULL,330.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:54:41.902409','',NULL,NULL,''),(32,30,'Apartment in Dubai',NULL,NULL,220.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:55:03.291525','',NULL,NULL,''),(33,31,'Apartment in Dubai',NULL,NULL,350.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:55:22.493993','',NULL,NULL,''),(34,32,'Apartment in Dubai',NULL,NULL,260.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:55:34.356117','',NULL,NULL,''),(35,33,'Condo in Dubai',NULL,NULL,310.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:55:53.146513','',NULL,NULL,''),(36,34,'Apartment in Dubai',NULL,NULL,290.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:56:21.003592','',NULL,NULL,''),(37,35,'Condo in Dubai',NULL,NULL,325.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:56:43.856577','',NULL,NULL,''),(38,36,'Condo in Dubai',NULL,NULL,372.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:56:58.384325','',NULL,NULL,''),(39,37,'Condo in Dubai',NULL,NULL,230.00,'Dubai',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-29 13:57:18.562403','',NULL,NULL,''),(87,56,'Apartment at Lahore',NULL,'This place to stay is surrounded by gorgeous landscapes and a rustic getaway full of adventure.',25.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,1,1,1,NULL,NULL,NULL,'2025-09-09 14:22:46.154715','House','room','published','finish'),(101,56,'Home in Lahore',NULL,'This place to stay is a memorable place you’ll treasure and surrounded by gorgeous landscapes.',65.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,4,3,6,NULL,NULL,NULL,'2025-09-16 14:08:23.169198','Apartment','entire','published','finish'),(102,56,'House in Lahore',NULL,'This place to stay is a memorable place you’ll treasure and surrounded by gorgeous landscapes.',76.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,2,4,3,NULL,NULL,NULL,'2025-09-16 14:22:50.257248','House','room','published','finish'),(103,56,'Cabin in Lahore',NULL,'This place to stay is a memorable place you’ll treasure and surrounded by gorgeous landscapes.',87.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,2,2,2,NULL,NULL,NULL,'2025-09-16 14:31:25.136310','Cabin','room','published','finish'),(104,56,'Cabin in Lahore',NULL,'This place to stay is a unique, historic stay and a rustic getaway full of adventure.',84.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,2,2,3,NULL,NULL,NULL,'2025-09-16 14:33:36.053727','Apartment','room','published','finish'),(105,56,'Room in Lahore',NULL,'This place to stay is a memorable place you’ll treasure and a unique, historic stay.',65.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,2,2,2,NULL,NULL,NULL,'2025-09-16 14:40:43.566569','Casa particular','room','published','finish'),(106,64,'Apartment in Lahore',NULL,'This place to stay is a rustic getaway full of adventure and a romantic place with special details.',76.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,1,4,4,NULL,NULL,NULL,'2025-09-16 14:49:36.462474','Bed & breakfast','room','published','finish'),(107,64,'Apartment in Lahore',NULL,'This place to stay is surrounded by gorgeous landscapes and a unique, historic stay.',84.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,2,3,3,NULL,NULL,NULL,'2025-09-16 15:03:00.325496','Apartment','room','published','finish'),(108,64,'Condo in Lahore',NULL,'This place to stay is a memorable place you’ll treasure and surrounded by gorgeous landscapes.',25.00,'Lahore','54000','The Garden Spice, Canal Rd, adjacent Green Forts 2, Jhelum Block Green Forts 2, Lahore, 54000',NULL,NULL,4,2,2,2,NULL,NULL,NULL,'2025-09-16 15:51:02.139079','House','shared','published','finish');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message_text` text,
  `file_url` text,
  `message_type` enum('text','image','file','system') NOT NULL DEFAULT 'text',
  `status` enum('sent','delivered','seen') NOT NULL DEFAULT 'sent',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_22133395bd13b970ccd0c34ab22` (`sender_id`),
  KEY `FK_b561864743d235f44e70addc1f5` (`receiver_id`),
  KEY `FK_3bc55a7c3f9ed54b520bb5cfe23` (`conversation_id`),
  CONSTRAINT `FK_22133395bd13b970ccd0c34ab22` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_3bc55a7c3f9ed54b520bb5cfe23` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_b561864743d235f44e70addc1f5` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (5,5,64,56,'A new booking has been made for your listing \"Apartment at Lahore\".',NULL,'system','sent','2025-09-15 03:16:36.142613'),(77,5,56,64,'good',NULL,'text','sent','2025-09-15 14:27:38.584698'),(78,5,64,56,'thanks',NULL,'text','sent','2025-09-15 14:28:21.306864'),(79,5,56,64,'ok',NULL,'text','sent','2025-09-15 14:31:49.552282'),(80,5,56,64,'ook',NULL,'text','sent','2025-09-15 14:34:09.898223'),(81,5,64,56,'jh',NULL,'text','sent','2025-09-15 14:34:24.524470'),(82,5,56,64,'ok',NULL,'text','sent','2025-09-15 14:45:21.458489'),(83,5,64,56,'no',NULL,'text','sent','2025-09-15 14:45:49.205219'),(84,5,56,64,'yes',NULL,'text','sent','2025-09-15 14:48:38.824215'),(85,5,56,64,'look',NULL,'text','sent','2025-09-15 14:50:55.429102'),(86,5,56,64,'loca',NULL,'text','sent','2025-09-15 14:52:23.021011'),(87,5,64,56,'no',NULL,'text','sent','2025-09-15 14:55:26.805165'),(88,5,56,64,'yes',NULL,'text','sent','2025-09-15 14:55:32.713575'),(89,5,56,64,'ok',NULL,'text','sent','2025-09-15 15:00:49.395652'),(90,6,65,56,'A new booking has been made for your listing \"Apartment at Lahore\".',NULL,'system','sent','2025-09-15 17:00:54.707617');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_subscriptions`
--

DROP TABLE IF EXISTS `push_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `p256dh` varchar(255) NOT NULL,
  `auth` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `endpoint` varchar(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0008bdfd174e533a3f98bf9af1` (`endpoint`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_subscriptions`
--

LOCK TABLES `push_subscriptions` WRITE;
/*!40000 ALTER TABLE `push_subscriptions` DISABLE KEYS */;
INSERT INTO `push_subscriptions` VALUES (6,56,'BDytydQVHF3oFX4jAYy74AXXtUFMwwfLVqv77wybc99cDL6z0UyX6j5z-pB7pw_YslMOVRn615bfXvK0KFlkQsE','UE8EVdY2Q1A-BvryJtdX_g','2025-09-11 16:04:54.125006','https://fcm.googleapis.com/fcm/send/ddLWxVvwLdM:APA91bFVkTLzLS5OlvQjrtJ14aTSzoDiQy3SD0BNDexMsMGalfZS8lL-xVHCXiS6s5iaYi86teF6Ej7B9WaydYxQwrHUZkVIRJfqhQvzlu0SJQ1g_4j-Yjvh3jmieLo5qE0-U-JLp5FT'),(10,65,'BHnyo9J8gy48AA2W-ez8B2ojxy8TOiMn60B0sVbBogI9QGHOMpc-bzBrc_cM0Muh2iJycKaDuCxDEXQQM0skoqM','GyUBgzr2RdJsiYqNVdkutA','2025-09-13 02:23:37.919476','https://wns2-pn1p.notify.windows.com/w/?token=BQYAAADyY8BNoO8ujFEgc2m3AMVPjopPuRBCWlGhqFVVkIp9%2bs4DEmWkIeI39WA71XtdJ7fY1DtmYvM9ZhH3WFgbB95dfsfRLVfhiU461ogp5bXjM2pY1f2kqMOrJATpPlUY9paQYGktol%2bfUrftvEFoCzZLIA2HpwwLnFsoz3I4NX0HF6bbdKsXOZs9xFhw85Fk3%2faEncg5tj3Jf%2fieVgqqcHvJS8c8WP4M8zSTF5VJ7hCnDDhgRd0%2benKOC2PruTbwuI%2fCRuIVsQoEl0NjIVxieIkvEPJ4TidMDi6d9jOUx83RoXBvjJTs0Npt%2bU3vrYEHtYi68BUAJEXASlBgHVmmtUJ9');
/*!40000 ALTER TABLE `push_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_details`
--

DROP TABLE IF EXISTS `review_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `score` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `review_details_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_details`
--

LOCK TABLES `review_details` WRITE;
/*!40000 ALTER TABLE `review_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `guest_id` int NOT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `comment` text,
  `location` varchar(100) DEFAULT NULL,
  `stay_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `listing_id` (`listing_id`),
  KEY `guest_id` (`guest_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `image_url` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_id` (`listing_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `safety`
--

DROP TABLE IF EXISTS `safety`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `safety` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `safety_item` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_id` (`listing_id`),
  CONSTRAINT `safety_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `safety`
--

LOCK TABLES `safety` WRITE;
/*!40000 ALTER TABLE `safety` DISABLE KEYS */;
/*!40000 ALTER TABLE `safety` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_picture` text,
  `role` enum('guest','host','admin') NOT NULL DEFAULT 'guest',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'user5@example.com','dummy_hash','03000000005',NULL,'host','2025-09-05 12:00:56.873167','User Five','User','Five','1990-01-01'),(5,'user6@example.com','dummy_hash','03000000006',NULL,'host','2025-09-05 12:00:56.873167','User Six','User','Six','1990-01-02'),(6,'user7@example.com','dummy_hash','03000000007',NULL,'host','2025-09-05 12:00:56.873167','User Seven','User','Seven','1990-01-03'),(7,'user8@example.com','dummy_hash','03000000008',NULL,'host','2025-09-05 12:00:56.873167','User Eight','User','Eight','1990-01-04'),(8,'user9@example.com','dummy_hash','03000000009',NULL,'host','2025-09-05 12:00:56.873167','User Nine','User','Nine','1990-01-05'),(9,'user10@example.com','dummy_hash','03000000010',NULL,'host','2025-09-05 12:00:56.873167','User Ten','User','Ten','1990-01-06'),(10,'user11@example.com','dummy_hash','03000000011',NULL,'host','2025-09-05 12:00:56.873167','User Eleven','User','Eleven','1990-01-07'),(11,'user12@example.com','dummy_hash','03000000012',NULL,'host','2025-09-05 12:00:56.873167','User Twelve','User','Twelve','1990-01-08'),(12,'user13@example.com','dummy_hash','03000000013',NULL,'host','2025-09-05 12:00:56.873167','User Thirteen','User','Thirteen','1990-01-09'),(13,'user14@example.com','dummy_hash','03000000014',NULL,'host','2025-09-05 12:00:56.873167','User Fourteen','User','Fourteen','1990-01-10'),(14,'user15@example.com','dummy_hash','03000000015',NULL,'host','2025-09-05 12:00:56.873167','User Fifteen','User','Fifteen','1990-01-11'),(15,'user16@example.com','dummy_hash','03000000016',NULL,'host','2025-09-05 12:00:56.873167','User Sixteen','User','Sixteen','1990-01-12'),(16,'user17@example.com','dummy_hash','03000000017',NULL,'host','2025-09-05 12:00:56.873167','User Seventeen','User','Seventeen','1990-01-13'),(17,'user18@example.com','dummy_hash','03000000018',NULL,'host','2025-09-05 12:00:56.873167','User Eighteen','User','Eighteen','1990-01-14'),(18,'user19@example.com','dummy_hash','03000000019',NULL,'host','2025-09-05 12:00:56.873167','User Nineteen','User','Nineteen','1990-01-15'),(19,'user20@example.com','dummy_hash','03000000020',NULL,'host','2025-09-05 12:00:56.873167','User Twenty','User','Twenty','1990-01-16'),(20,'user21@example.com','dummy_hash','03000000021',NULL,'host','2025-09-05 12:00:56.873167','User TwentyOne','User','TwentyOne','1990-01-17'),(21,'user22@example.com','dummy_hash','03000000022',NULL,'host','2025-09-05 12:00:56.873167','User TwentyTwo','User','TwentyTwo','1990-01-18'),(22,'user23@example.com','dummy_hash','03000000023',NULL,'host','2025-09-05 12:00:56.873167','User TwentyThree','User','TwentyThree','1990-01-19'),(23,'user24@example.com','dummy_hash','03000000024',NULL,'host','2025-09-05 12:00:56.873167','User TwentyFour','User','TwentyFour','1990-01-20'),(24,'user25@example.com','dummy_hash','03000000025',NULL,'host','2025-09-05 12:00:56.873167','User TwentyFive','User','TwentyFive','1990-01-21'),(25,'user26@example.com','dummy_hash','03000000026',NULL,'host','2025-09-05 12:00:56.873167','User TwentySix','User','TwentySix','1990-01-22'),(26,'user27@example.com','dummy_hash','03000000027',NULL,'host','2025-09-05 12:00:56.873167','User TwentySeven','User','TwentySeven','1990-01-23'),(27,'user28@example.com','dummy_hash','03000000028',NULL,'host','2025-09-05 12:00:56.873167','User TwentyEight','User','TwentyEight','1990-01-24'),(28,'user29@example.com','dummy_hash','03000000029',NULL,'host','2025-09-05 12:00:56.873167','User TwentyNine','User','TwentyNine','1990-01-25'),(29,'user30@example.com','dummy_hash','03000000030',NULL,'host','2025-09-05 12:00:56.873167','User Thirty','User','Thirty','1990-01-26'),(30,'user31@example.com','dummy_hash','03000000031',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyOne','User','ThirtyOne','1990-01-27'),(31,'user32@example.com','dummy_hash','03000000032',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyTwo','User','ThirtyTwo','1990-01-28'),(32,'user33@example.com','dummy_hash','03000000033',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyThree','User','ThirtyThree','1990-01-29'),(33,'user34@example.com','dummy_hash','03000000034',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyFour','User','ThirtyFour','1990-01-30'),(34,'user35@example.com','dummy_hash','03000000035',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyFive','User','ThirtyFive','1990-01-31'),(35,'user36@example.com','dummy_hash','03000000036',NULL,'host','2025-09-05 12:00:56.873167','User ThirtySix','User','ThirtySix','1990-02-01'),(36,'user37@example.com','dummy_hash','03000000037',NULL,'host','2025-09-05 12:00:56.873167','User ThirtySeven','User','ThirtySeven','1990-02-02'),(37,'user38@example.com','dummy_hash','03000000038',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyEight','User','ThirtyEight','1990-02-03'),(38,'user39@example.com','dummy_hash','03000000039',NULL,'host','2025-09-05 12:00:56.873167','User ThirtyNine','User','ThirtyNine','1990-02-04'),(56,'hamzanadeem2398@gmail.com','$2b$10$R2OKQRUOrVrH26TksATlW.5km6t9w5RSaNKuXBvHqNIvktDBm0W02',NULL,NULL,'guest','2025-09-09 13:10:45.351513','Hamza Nadeem','Hamza','Nadeem',NULL),(64,'hamzanadeem1265@gmail.com','$2b$10$FMKk4JJ6WqjrXK27GmoJIeSFKuDXTp55jXOSIrkdbzi/P79aEWEzG',NULL,NULL,'guest','2025-09-11 16:07:32.989230','Hamza Nadeem','Hamza','Nadeem',NULL),(65,'22103733@uskt.edu.pk','$2b$10$K298Y2ct4qQ/.oSykiJ2ae8r701y3vydSIXnZ3SzkufuKSC3ymoDu',NULL,NULL,'guest','2025-09-14 16:25:38.726684','Mr Ahsan','Mr','Ahsan',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `listing_id` int NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_512bf776587ad5fc4f804277d76` (`user_id`),
  KEY `FK_1bc2f18ef560f2220c907c20658` (`listing_id`),
  CONSTRAINT `FK_1bc2f18ef560f2220c907c20658` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_512bf776587ad5fc4f804277d76` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (1,56,87,'2025-09-17 09:03:17.523050'),(3,56,102,'2025-09-17 09:24:35.713948'),(4,56,5,'2025-09-17 09:25:09.910813'),(5,56,11,'2025-09-17 09:25:41.277028'),(6,56,23,'2025-09-17 09:26:07.816013'),(7,56,32,'2025-09-17 09:26:35.067480');
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-17 19:19:31
