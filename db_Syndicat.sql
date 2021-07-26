-- MariaDB dump 10.18  Distrib 10.4.17-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_syndicat
-- ------------------------------------------------------
-- Server version	10.4.17-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `db_syndicat`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `db_syndicat` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `db_syndicat`;

--
-- Table structure for table `annonce`
--

DROP TABLE IF EXISTS `annonce`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `annonce` (
  `RefAnnonce` int(11) NOT NULL AUTO_INCREMENT,
  `NumCompte` int(11) NOT NULL,
  `dateAnnonce` date NOT NULL DEFAULT current_timestamp(),
  `Sujet` varchar(100) NOT NULL,
  `DescripAnnonce` text DEFAULT NULL,
  `statut` bit(1) DEFAULT b'1',
  PRIMARY KEY (`RefAnnonce`),
  KEY `fk_ann_compte` (`NumCompte`),
  CONSTRAINT `fk_ann_compte` FOREIGN KEY (`NumCompte`) REFERENCES `compte` (`NumCompte`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annonce`
--

LOCK TABLES `annonce` WRITE;
/*!40000 ALTER TABLE `annonce` DISABLE KEYS */;
INSERT INTO `annonce` VALUES (13,1,'2021-07-02','Bonsoir Tous le Monde ','Notre première annonce !  ',''),(16,1,'2021-07-09','Avis au Copropriétaire','Heellllo 2nd Announcement',''),(44,1,'2021-07-13','ola','ola olato',''),(48,1,'2021-07-13','je vous annonce que ..','Bonsoir à vous tous mes amies',''),(49,37,'2021-07-15','Hello','My Name is El Meknasi Ali','');
/*!40000 ALTER TABLE `annonce` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendrier`
--

DROP TABLE IF EXISTS `calendrier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendrier` (
  `RefCalendrier` int(11) NOT NULL AUTO_INCREMENT,
  `RefPaiement` varchar(50) NOT NULL,
  `RefLogement` varchar(30) NOT NULL,
  `Du` date DEFAULT NULL,
  `Au` date DEFAULT NULL,
  PRIMARY KEY (`RefCalendrier`),
  KEY `fk_cal_log` (`RefLogement`),
  KEY `fk_cale_pai` (`RefPaiement`),
  CONSTRAINT `fk_cal_log` FOREIGN KEY (`RefLogement`) REFERENCES `logement` (`RefLogement`),
  CONSTRAINT `fk_cale_pai` FOREIGN KEY (`RefPaiement`) REFERENCES `paiement` (`RefPaiement`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendrier`
--

LOCK TABLES `calendrier` WRITE;
/*!40000 ALTER TABLE `calendrier` DISABLE KEYS */;
INSERT INTO `calendrier` VALUES (20,'72021204239','imm app 1 résidence 3 Mars','2021-07-01','2021-10-01'),(21,'7202104554','imm app 2 résidence 3 Mars','2021-09-01','2022-01-01'),(22,'720211110','imm app 3 Résidence 3 Mars','2021-01-01','2021-04-01'),(26,'7202111229','imm app 4 résidence 3 Mars','2021-01-01','2021-02-01'),(27,'7202115824','imm app 1 résidence 3 Mars','2021-11-01','2021-12-01'),(28,'72021105837','imm app 4 résidence 3 Mars','2021-03-01','2021-06-01'),(29,'720218034','imm app 6 résidence 3 Mars','2021-01-01','2021-03-01'),(30,'720218410','imm app 7 résidence 3 Mars','2021-01-01','2021-02-01'),(32,'7202118368','imm app 9 résidence 3 Mars','2021-01-01','2021-08-01'),(33,'72021183646','imm app 10 résidence 3 Mars','2021-01-01','2021-07-01'),(34,'7202112134','imm app 6 résidence 3 Mars','2021-04-01','2021-06-01'),(35,'72021185713','imm app 11 résidence 3 Mars','2021-01-01','2021-05-01'),(36,'72021194525','imm app 11 résidence 3 Mars','2021-06-01','2021-10-01');
/*!40000 ALTER TABLE `calendrier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorie` (
  `NomCategorie` varchar(50) NOT NULL,
  PRIMARY KEY (`NomCategorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorie`
--

LOCK TABLES `categorie` WRITE;
/*!40000 ALTER TABLE `categorie` DISABLE KEYS */;
INSERT INTO `categorie` VALUES ('Ascenseur'),('Electricité'),('Jardinage'),('Le Personnel '),('Matériels '),('Piscine'),('Taxes');
/*!40000 ALTER TABLE `categorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cheque`
--

DROP TABLE IF EXISTS `cheque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cheque` (
  `NumCheque` int(11) NOT NULL AUTO_INCREMENT,
  `RefPaiement` varchar(50) NOT NULL,
  `Banque` varchar(30) NOT NULL,
  `NumeroCheque` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`NumCheque`),
  KEY `fk_che_pai` (`RefPaiement`),
  CONSTRAINT `fk_che_pai` FOREIGN KEY (`RefPaiement`) REFERENCES `paiement` (`RefPaiement`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheque`
--

LOCK TABLES `cheque` WRITE;
/*!40000 ALTER TABLE `cheque` DISABLE KEYS */;
INSERT INTO `cheque` VALUES (6,'72021204239','BMCE','JKS9764679'),(7,'720211110','Barid Banque','HDG7853478975412'),(9,'7202111229','BMCI','N9882300'),(10,'7202115824','Banque Populaire','N89912457650090'),(14,'72021105837','BMCE','N789000556'),(15,'720218034','BMCE','KIF6288943372'),(16,'72021183646','BMCE','N°5644688809054456'),(17,'72021194525','BMCE','NJKK665345789996');
/*!40000 ALTER TABLE `cheque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compte`
--

DROP TABLE IF EXISTS `compte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compte` (
  `NumCompte` int(11) NOT NULL AUTO_INCREMENT,
  `NomCompte` varchar(30) NOT NULL,
  `PrenomCompte` varchar(30) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `fonc` varchar(30) NOT NULL,
  `EmailCompte` varchar(50) NOT NULL,
  `telephone` varchar(10) NOT NULL,
  `PasswordCompte` varchar(100) DEFAULT NULL,
  `photo` varchar(100) NOT NULL DEFAULT 'compte.ico',
  PRIMARY KEY (`NumCompte`),
  UNIQUE KEY `EmailCompte` (`EmailCompte`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compte`
--

LOCK TABLES `compte` WRITE;
/*!40000 ALTER TABLE `compte` DISABLE KEYS */;
INSERT INTO `compte` VALUES (1,'Benfarhi','Zack ','Administrateur','Trésorier','zack123.benfarhi@gmail.com','0629348422','$2b$10$IvCPgpgJ7f2bcNKYS3McK.sKKM3gQFp07bRNg1xICefAwBRSr5Xz2','1626418173120-4ef7fe7c-ee12-4440-bda1-e5c481085f8f.jfif'),(16,'Benfarhi','Mohammed','Copropriétaire','Copropriétaire','benfarhi_mohammed@gmail.com','0612121222','$2b$10$vIgo5pxJQ1KseVUliw2orOPeKN6yU3xiMi/K4jCUsXSMyfzwPdroq','1627112197311-IMG_20191227_181947.jpg'),(24,'Hssaine','Meryem','Copropriétaire','Copropriétaire ','test@gmail.com','0632556263','$2b$10$da3HfbehxlvlmBZo.ITqEurn9uBuy0YWcqW5YWu9KINxT6kqCGiVW','compte.ico'),(25,'Hssaine ','Rajae ','Copropriétaire','Copropriétaire','hssaine@gmail.com','0673774058','$2b$10$o6q6XGQbWBezuRgMiEuFUusv4EWgy/Owyr6V3nM9K9vujeLJL15I6','compte.ico'),(36,'El Morabit','Mouad','Copropriétaire','Copropriétaire','mouad_morabit@gmail.com','0741763207','$2b$10$ITbbQjjLGRKJ7uDAKFU7euVe6bR01K9x5OJTprBb8A.lipwxF.kh6','compte.ico'),(37,'El Meknasi ','Ali Mohammed ','Administrateur','Vice-Président','ali.meknasi@gmail.com','0629348002','$2b$10$s5BAUzqvrlJV0/v2VB7SLuV8U80D3dulWawTrO9H4DiA2JTGtiWHe','1626978219538-dofus-2020-05-10_00-36-18-Kilys-roub.png'),(51,'Adil','Salah','Copropriétaire','Copropriétaire','salah-eddine0Adil@gmail.com','0626332671','$2b$10$gnj/.grzYQN9tOBXbhwFeuLJ57xP4aH8q4kH9bUjFFdzpvn5NnGS2','compte.ico'),(52,'Arif','Nabil','Copropriétaire','Copropriétaire','nabil@gmail.com','0628083781','$2b$10$0ibhlT6xf0.Ny6dQC8A4j.wgHw/eXB4onSFwIIbmW8OIanFExmBC2','compte.ico'),(53,'Alaoui','Moncef','Copropriétaire','Copropriétaire','moncef12@gmail.com','0672836008','$2b$10$k13emuBDTwnPTxcadAP4eOSszSoKAZlxlao.CdY0EAbujsZEDd/nC','compte.ico'),(54,'El Kafi','Yassine','Copropriétaire','Copropriétaire','yas_kafi@gmail.com','0725687449','$2b$10$YtRaCXc07cGvmiHVgsCI8unOLgVdWmr48.q9/5PjcB.Hgnr19vBzS','compte.ico'),(55,'Aitoubba','Mehdi','Copropriétaire','Copropriétaire','mehdiAit@gmail.com','0724599058','$2b$10$f33gTBiuz06GKM7XMmc7aeg76LZzvESu/utRee1qP2v1r5VOQt2V6','compte.ico'),(56,'BenIssa','Mohamed','Copropriétaire','Copropriétaire','benissa1@gmail.com','0634590707','$2b$10$ZUuHgdtFblPWQSHa43Ffl.O/x3AWWj6/cHcOsrcjv9580e4hYJ7QO','compte.ico');
/*!40000 ALTER TABLE `compte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `depense`
--

DROP TABLE IF EXISTS `depense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `depense` (
  `RefDepense` int(11) NOT NULL AUTO_INCREMENT,
  `NumCompte` int(11) NOT NULL,
  `NomCategorie` varchar(50) NOT NULL,
  `dateDepense` date NOT NULL DEFAULT current_timestamp(),
  `MontantDepense` double NOT NULL,
  `facture` varchar(50) NOT NULL,
  `descriptionDepense` text DEFAULT NULL,
  PRIMARY KEY (`RefDepense`),
  KEY `fk_dep_cat` (`NomCategorie`),
  KEY `fk_dep_compte` (`NumCompte`),
  CONSTRAINT `fk_dep_cat` FOREIGN KEY (`NomCategorie`) REFERENCES `categorie` (`NomCategorie`),
  CONSTRAINT `fk_dep_compte` FOREIGN KEY (`NumCompte`) REFERENCES `compte` (`NumCompte`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `depense`
--

LOCK TABLES `depense` WRITE;
/*!40000 ALTER TABLE `depense` DISABLE KEYS */;
INSERT INTO `depense` VALUES (10,1,'Electricité','2021-07-08',830,'K7260037','Paiement la facture d\'électricité'),(11,1,'Piscine','2021-07-12',670,'N97656700','Facture du Jardinage'),(12,1,'Ascenseur','2021-07-02',300,'H8997','Réparation les 2 Ascenseurs'),(13,1,'Piscine','2021-07-16',200,'JDD6782984','Réparation du moteur'),(14,37,'Jardinage','2021-06-21',200,'N567745','Facture du Jardinage'),(15,37,'Electricité','2021-06-28',400,'KL445268056','Facture d\'électricité '),(16,1,'Jardinage','2021-07-18',180,'N°45670066','Plantes pour Jardin'),(17,1,'Matériels ','2021-07-18',200,'JS6898223900','Tuyau ultarfex 19x50 m'),(18,1,'Taxes','2021-07-18',110,'N67372838999','Frais et Commissions Bancaires'),(19,1,'Matériels ','2021-07-18',500,'N06273688','Écran extranet pour Jardin 2x10 m'),(20,1,'Matériels ','2021-06-19',130,'N62778289888','Couvertures en plastique des égouts'),(21,1,'Matériels ','2021-07-19',160,'N754567890007','Produit de nettoyage des escaliers'),(22,1,'Le Personnel ','2021-07-24',1700,'N67257890008','Cotisation CNSS');
/*!40000 ALTER TABLE `depense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document` (
  `RefDocument` int(11) NOT NULL AUTO_INCREMENT,
  `RefAnnonce` int(11) NOT NULL,
  `contenuDocument` varchar(100) NOT NULL,
  PRIMARY KEY (`RefDocument`),
  KEY `fk_ann_doc` (`RefAnnonce`),
  CONSTRAINT `fk_ann_doc` FOREIGN KEY (`RefAnnonce`) REFERENCES `annonce` (`RefAnnonce`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
INSERT INTO `document` VALUES (25,44,'1626138801106-Capture d’écran (31).png'),(28,48,'1626144280601-Capture d’écran (3).png'),(29,49,'1626342926903-Capture d’écran (10).png');
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logement`
--

DROP TABLE IF EXISTS `logement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logement` (
  `RefLogement` varchar(30) NOT NULL,
  `NumCompteCop` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`RefLogement`),
  KEY `fk_log_compte` (`NumCompteCop`),
  CONSTRAINT `fk_log_compte` FOREIGN KEY (`NumCompteCop`) REFERENCES `compte` (`NumCompte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logement`
--

LOCK TABLES `logement` WRITE;
/*!40000 ALTER TABLE `logement` DISABLE KEYS */;
INSERT INTO `logement` VALUES ('imm app 1 résidence 3 Mars',16,'app'),('imm app 10 résidence 3 Mars',56,'app'),('imm app 11 résidence 3 Mars',16,'app'),('imm app 2 résidence 3 Mars',24,'app'),('imm app 3 Résidence 3 Mars',25,'app'),('imm app 4 résidence 3 Mars',36,'app'),('imm app 5 résidence 3 Mars',51,'app'),('imm app 6 résidence 3 Mars',52,'app'),('imm app 7 résidence 3 Mars',53,'app'),('imm app 8 résidence 3 Mars',54,'app'),('imm app 9 résidence 3 Mars',55,'app');
/*!40000 ALTER TABLE `logement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiement`
--

DROP TABLE IF EXISTS `paiement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiement` (
  `RefPaiement` varchar(50) NOT NULL,
  `RefLogement` varchar(30) NOT NULL,
  `NumCompte` int(11) NOT NULL,
  `datePaiement` date NOT NULL DEFAULT current_timestamp(),
  `NbrMois` int(11) DEFAULT 1,
  `MethodePaiement` varchar(10) DEFAULT 'Espèce',
  `Montant` double NOT NULL,
  PRIMARY KEY (`RefPaiement`),
  KEY `fk_compte_pai` (`NumCompte`),
  KEY `fk_log_pai` (`RefLogement`),
  CONSTRAINT `fk_compte_pai` FOREIGN KEY (`NumCompte`) REFERENCES `compte` (`NumCompte`),
  CONSTRAINT `fk_log_pai` FOREIGN KEY (`RefLogement`) REFERENCES `logement` (`RefLogement`),
  CONSTRAINT `methode_val` CHECK (`MethodePaiement` in ('Espèce','Chèque'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiement`
--

LOCK TABLES `paiement` WRITE;
/*!40000 ALTER TABLE `paiement` DISABLE KEYS */;
INSERT INTO `paiement` VALUES ('7202104554','imm app 2 résidence 3 Mars',1,'2021-06-07',4,'Espèce',800),('72021105837','imm app 4 résidence 3 Mars',37,'2021-07-15',3,'Chèque',600),('720211110','imm app 3 Résidence 3 Mars',1,'2021-07-07',3,'Chèque',600),('7202111229','imm app 4 résidence 3 Mars',1,'2021-07-13',1,'Chèque',200),('7202112134','imm app 6 résidence 3 Mars',1,'2021-07-19',2,'Espèce',400),('7202115824','imm app 1 résidence 3 Mars',1,'2021-07-14',1,'Chèque',200),('72021183646','imm app 10 résidence 3 Mars',1,'2021-07-18',6,'Chèque',1200),('7202118368','imm app 9 résidence 3 Mars',1,'2021-07-18',7,'Espèce',1400),('72021185713','imm app 11 résidence 3 Mars',1,'2021-07-23',4,'Espèce',800),('72021194525','imm app 11 résidence 3 Mars',1,'2021-07-24',4,'Chèque',800),('72021204239','imm app 1 résidence 3 Mars',1,'2021-06-06',3,'Chèque',600),('720218034','imm app 6 résidence 3 Mars',1,'2021-07-16',2,'Chèque',400),('720218410','imm app 7 résidence 3 Mars',1,'2021-07-16',1,'Espèce',200);
/*!40000 ALTER TABLE `paiement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamation`
--

DROP TABLE IF EXISTS `reclamation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reclamation` (
  `RefReclamation` int(11) NOT NULL AUTO_INCREMENT,
  `RefLogement` varchar(30) NOT NULL,
  `Objet` varchar(100) NOT NULL,
  `Message` text DEFAULT NULL,
  `dateReclamation` date NOT NULL DEFAULT current_timestamp(),
  `statut` varchar(20) DEFAULT 'Envoyé',
  `pour` varchar(10) DEFAULT 'Privée',
  PRIMARY KEY (`RefReclamation`),
  KEY `fk_rec_log` (`RefLogement`),
  CONSTRAINT `fk_rec_log` FOREIGN KEY (`RefLogement`) REFERENCES `logement` (`RefLogement`),
  CONSTRAINT `pour_val` CHECK (`pour` in ('Privée','Public')),
  CONSTRAINT `statut_val` CHECK (`statut` in ('Envoyé','En cours','Résolue','Echoué'))
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamation`
--

LOCK TABLES `reclamation` WRITE;
/*!40000 ALTER TABLE `reclamation` DISABLE KEYS */;
INSERT INTO `reclamation` VALUES (1,'imm app 1 résidence 3 Mars','Réclamation N°1','Testing Reclamation','2021-07-01','Echoué','Public'),(2,'imm app 4 résidence 3 Mars','Réc 2','Hello this is my 2nd Réclamation.','2021-07-08','Envoyé','Privée'),(3,'imm app 4 résidence 3 Mars','helloooo','hey','2021-07-12','Envoyé','Public'),(4,'imm app 4 résidence 3 Mars','ok','ok','2021-07-12','Envoyé','Privée'),(5,'imm app 5 résidence 3 Mars','this is with a supported pic','Uploading image','2021-07-13','Envoyé','Privée'),(6,'imm app 5 résidence 3 Mars','hey everyone','this is again here','2021-07-13','Envoyé','Privée'),(19,'imm app 5 résidence 3 Mars','hkl','hjl','2021-07-13','Envoyé','Privée'),(20,'imm app 5 résidence 3 Mars','Est une Réclamation ?','Yeap, c\'est une Réclamation','2021-07-13','En Cours','Public');
/*!40000 ALTER TABLE `reclamation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support`
--

DROP TABLE IF EXISTS `support`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `support` (
  `NumSupport` int(11) NOT NULL AUTO_INCREMENT,
  `RefReclamation` int(11) NOT NULL,
  `contenu` varchar(100) NOT NULL,
  PRIMARY KEY (`NumSupport`),
  KEY `fk_sup_rec` (`RefReclamation`),
  CONSTRAINT `fk_sup_rec` FOREIGN KEY (`RefReclamation`) REFERENCES `reclamation` (`RefReclamation`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support`
--

LOCK TABLES `support` WRITE;
/*!40000 ALTER TABLE `support` DISABLE KEYS */;
INSERT INTO `support` VALUES (10,19,'1626143997995-Capture d’écran (35).png'),(11,20,'1626144221731-223 (2).png');
/*!40000 ALTER TABLE `support` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'db_syndicat'
--

--
-- Dumping routines for database 'db_syndicat'
--
/*!50003 DROP PROCEDURE IF EXISTS `Calendrier` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Calendrier`(IN `log` VARCHAR(30), IN `paied` VARCHAR(30), IN `mois` INT)
BEGIN
DECLARE DU varchar(30) DEFAULT '2021-01-01';
set DU = (select date_add(cal.Au, INTERVAL 1 month) AS DU from calendrier cal, logement l, paiement p WHERE p.RefLogement = l.RefLogement and p.RefPaiement = cal.RefPaiement and l.RefLogement = log ORDER BY cal.RefCalendrier DESC LIMIT 1);
IF DU = NULL OR DU is NULL OR DU = "" THEN
	SET DU = '2021-01-01';
END IF;
SELECT DU;
INSERT INTO calendrier (RefPaiement, RefLogement, Du, Au) VALUES (paied, log, DU, date_add(DU, INTERVAL mois month));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `data_Cotisation` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `data_Cotisation`()
    NO SQL
select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque  from compte co, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement ORDER BY cal.RefCalendrier DESC ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `data_Cotisation_Bylogement` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `data_Cotisation_Bylogement`(IN `logement` VARCHAR(30))
    NO SQL
SELECT p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque from compte co, cheque c right JOIN paiement p on c.RefPaiement = p.RefPaiement INNER JOIN calendrier cal on cal.RefPaiement = p.RefPaiement WHERE co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) AND p.RefLogement = logement ORDER by p.RefPaiement DESC ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `data_mes_cotisations` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `data_mes_cotisations`(IN `coproprietaire` VARCHAR(10))
    NO SQL
select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque from compte co, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement and co.NumCompte = coproprietaire ORDER by cal.Au DESC ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getData_Paiement_by_RefPaiement` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getData_Paiement_by_RefPaiement`(IN `paied` VARCHAR(50))
    NO SQL
SELECT c.NomCompte, c.PrenomCompte, p.RefLogement, p.NbrMois, p.Montant, p.MethodePaiement, p.datePaiement, ch.NumeroCheque, ch.Banque, cal.Du, cal.Au FROM compte c, logement l, calendrier cal, cheque ch RIGHT JOIN paiement p ON ch.RefPaiement = p.RefPaiement WHERE c.NumCompte = l.NumCompteCop and l.RefLogement = p.RefLogement AND p.RefPaiement = cal.RefPaiement and p.RefPaiement = paied ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Get_All_Les_Impayes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Get_All_Les_Impayes`()
    NO SQL
SELECT c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, cal.Au as du, ceil(datediff(CURRENT_TIMESTAMP, cal.Au) / 30) as periode, date_add(cal.Au, INTERVAL ceil(datediff(CURRENT_TIMESTAMP, cal.Au) / 30) month) as todate, l.RefLogement, p.datePaiement, p.MethodePaiement, ch.NumeroCheque, ch.Banque FROM compte c, calendrier cal, logement l, paiement p LEFT JOIN cheque ch ON p.RefPaiement = ch.RefPaiement WHERE c.NumCompte = l.NumCompteCop AND p.RefLogement = l.RefLogement AND cal.RefPaiement = p.RefPaiement GROUP BY c.NumCompte HAVING cal.Au < CURRENT_TIMESTAMP() AND COUNT(l.RefLogement) < 2 ORDER BY cal.RefCalendrier DESC ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `inert_paiement_cheque` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `inert_paiement_cheque`(IN paied varchar(50), IN log varchar(30), IN id int, IN mois int, IN methode varchar(10), IN montant double, IN NumeroCheque varchar(30), IN bnq varchar(30))
begin
		insert into paiement (RefPaiement, RefLogement, NumCompte, NbrMois, MethodePaiement, Montant) values (paied, log, id, mois, methode, montant);
		insert into cheque (RefPaiement, Banque, NumeroCheque) values (paied, bnq, NumeroCheque);
	END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_Rec` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_Rec`(IN `log` VARCHAR(30), IN `objet` VARCHAR(100), IN `message` TEXT, IN `pour` VARCHAR(10))
    NO SQL
BEGIN
       INSERT INTO reclamation (RefLogement, Objet, 		   Message, pour) VALUES (log, objet, message, 		   pour);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `mes_Reclamations` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `mes_Reclamations`(IN `id` VARCHAR(10))
    NO SQL
select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND c.NumCompte = id order by r.RefReclamation desc ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `read_last_calendrier_logement` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `read_last_calendrier_logement`(IN `logement` VARCHAR(30), OUT `du` VARCHAR(30))
    NO SQL
set du = (SELECT date_add(c.Au, INTERVAL 1 month) as du FROM calendrier c, paiement p where c.RefPaiement = p.RefPaiement AND p.RefLogement = logement order by c.RefCalendrier DESC LIMIT 1) ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `recla_public` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `recla_public`(IN `id` VARCHAR(10))
    NO SQL
select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND ( c.NumCompte = id OR r.pour = 'Public' ) order by r.RefReclamation desc ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `releves` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `releves`(IN `mois` INT, IN `year` INT)
    NO SQL
BEGIN
SELECT COUNT(p.RefPaiement) as NbrCotisation, SUM(p.Montant) AS MontantCotisation FROM paiement p WHERE month(p.datePaiement) = mois AND year(p.datePaiement) = year;
SELECT d.descriptionDepense, d.MontantDepense FROM depense d WHERE month(d.dateDepense) = mois AND year(d.dateDepense) = year; 
SELECT COUNT(d.RefDepense) as NbrDepense, SUM(d.MontantDepense) as MontantDepense FROM depense d WHERE month(d.dateDepense) = mois AND year(d.dateDepense) = year;
select distinct month(d.dateDepense) as month, year(d.dateDepense) as year from depense d WHERE month(d.dateDepense) = mois AND year(d.dateDepense) = year;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `statistiques` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `statistiques`()
    NO SQL
BEGIN
SELECT COUNT(d.RefDepense) as NbrDepense, SUM(d.MontantDepense) as montant FROM depense d;
SELECT COUNT(c.NumCompte) as NbrUsers FROM compte c;
SELECT COUNT(c.NumCompte) as admi FROM compte c WHERE c.Role = 'Administrateur' ;
SELECT COUNT(c.NumCompte) as copro FROM compte c WHERE c.Role = 'Copropriétaire';
SELECT COUNT(p.RefPaiement) as NbrPaiement, SUM(p.Montant) as montantPayed FROM paiement p;
SELECT COUNT(a.RefAnnonce) as NbrAnonce FROM annonce a;
SELECT COUNT(r.RefReclamation) AS NbrReclam FROM reclamation r;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `stats_du` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `stats_du`(IN `mois` VARCHAR(10), IN `annee` VARCHAR(10))
    NO SQL
BEGIN
SELECT COUNT(d.RefDepense) as NbrDepense, SUM(d.MontantDepense) as montant FROM depense d WHERE month(d.dateDepense) = mois AND year(d.dateDepense) = annee;
SELECT COUNT(c.NumCompte) as NbrUsers FROM compte c;
SELECT COUNT(c.NumCompte) as admi FROM compte c WHERE c.Role = 'Administrateur' ;
SELECT COUNT(c.NumCompte) as copro FROM compte c WHERE c.Role = 'Copropriétaire';
SELECT COUNT(p.RefPaiement) as NbrPaiement, SUM(p.Montant) as montantPayed FROM paiement p WHERE month(p.datePaiement) = mois AND year(p.datePaiement) = annee;
SELECT COUNT(a.RefAnnonce) as NbrAnonce FROM annonce a WHERE month(a.dateAnnonce) = mois AND year(a.dateAnnonce) = annee;
SELECT COUNT(r.RefReclamation) AS NbrReclam FROM reclamation r WHERE month(r.dateReclamation) = mois AND year(r.dateReclamation) = annee;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `upload_annonce` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upload_annonce`(IN `id` INT, IN `sujet` VARCHAR(100), IN `description` TEXT, IN `img` VARCHAR(100))
    NO SQL
BEGIN
INSERT INTO annonce (NumCompte, Sujet, descripAnnonce) VALUES (id, sujet, description);
INSERT INTO document (RefAnnonce, contenuDocument) VALUES (LAST_INSERT_ID(), img);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `upload_reclamation` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upload_reclamation`(IN `log` VARCHAR(30), IN `objt` VARCHAR(100), IN `msg` TEXT, IN `por` VARCHAR(10), IN `filename` VARCHAR(100))
    NO SQL
BEGIN
INSERT INTO reclamation (RefLogement, Objet, Message, pour) VALUES (log, objt, msg, por);
INSERT INTO support (RefReclamation, contenu) VALUES (LAST_INSERT_ID(), filename);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `up_cheque_paied` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `up_cheque_paied`(IN `paied` VARCHAR(30), IN `mois` INT, IN `mnt` INT, IN `meth` VARCHAR(10), IN `cheque` VARCHAR(30), IN `bnq` VARCHAR(30))
    NO SQL
BEGIN
DECLARE ref VARCHAR(30) DEFAULT '0';
SET ref = (SELECT RefPaiement FROM cheque WHERE RefPaiement = paied) ;
IF ref = NULL OR ref is NULL OR ref = "" THEN INSERT INTO cheque (RefPaiement, NumeroCheque, Banque) VALUES (paied, cheque, bnq) ;
END IF;
IF ref = paied THEN 
UPDATE cheque SET NumeroCheque = cheque, Banque = bnq WHERE RefPaiement = paied ;
END IF;
UPDATE paiement SET NbrMois = mois, MethodePaiement = meth, Montant = mnt WHERE RefPaiement = paied ;
UPDATE calendrier SET Au = date_add(DU, INTERVAL mois month) WHERE RefPaiement = paied ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `up_espece_paied` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `up_espece_paied`(IN `paied` VARCHAR(30), IN `mois` INT, IN `mnt` INT, IN `meth` VARCHAR(10))
    NO SQL
BEGIN
DELETE FROM cheque WHERE RefPaiement = paied ;
UPDATE paiement SET NbrMois = mois, MethodePaiement = meth, Montant = mnt WHERE RefPaiement = paied ;
UPDATE calendrier SET Au = date_add(DU, INTERVAL mois month) WHERE RefPaiement = paied ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-25 18:58:32
