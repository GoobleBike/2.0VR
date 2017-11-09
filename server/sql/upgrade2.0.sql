-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Nov 09, 2017 alle 18:01
-- Versione del server: 10.1.28-MariaDB
-- Versione PHP: 7.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gooble`
-- Upgrade da 0.9/1.5 a 2.0
--

-- --------------------------------------------------------

--
-- Struttura della tabella `stato`
--

-- CREATE TABLE `stato` (
--  `who` varchar(255) NOT NULL,
--  `id` int(11) NOT NULL,
--  `what` varchar(255) NOT NULL,
--  `how` varchar(255) NOT NULL,
--  `ts` datetime NOT NULL
-- ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `stato`
--

ALTER TABLE `stato` CHANGE `who` `who` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
ALTER TABLE `stato` CHANGE `who` `what` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE `stato` ENGINE = MySQL;

INSERT INTO `stato` (`who`, `id`, `what`, `how`, `ts`) VALUES
('gb', 0, 'a', '000', CURRENT_TIMESTAMP),
('wc', 0, 'lat', '44.493733',  CURRENT_TIMESTAMP),
('wc', 0, 'lng', ',11.342990',  CURRENT_TIMESTAMP),
('wc', 0, 'pov', '000',  CURRENT_TIMESTAMP);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `stato`
--
-- ALTER TABLE `stato`
--   ADD PRIMARY KEY (`who`,`id`,`what`);
-- COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
