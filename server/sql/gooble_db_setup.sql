-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Creato il: Nov 25, 2017 alle 09:07
-- Versione del server: 10.1.19-MariaDB
-- Versione PHP: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gooble`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `config`
--

CREATE TABLE `config` (
  `conf_key` varchar(255) NOT NULL,
  `conf_value` varchar(255) DEFAULT NULL,
  `conf_des` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `config`
--

INSERT INTO `config` (`conf_key`, `conf_value`, `conf_des`) VALUES
('gb', '0', 'gooble bike id'),
('gbto', '4', 'gooble bike timeout'),
('me', '0', 'web server id'),
('path', '1', 'path id'),
('wc', '0', 'web client id'),
('wcto', '4', 'web client timeout');

-- --------------------------------------------------------

--
-- Struttura della tabella `log`
--

CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `lid` int(11) NOT NULL,
  `lkey` varchar(255) NOT NULL,
  `lvalue` varchar(5000) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `logstato`
--

CREATE TABLE `logstato` (
  `log_id` int(11) NOT NULL,
  `who` varchar(255) NOT NULL,
  `id` int(11) NOT NULL,
  `what` varchar(255) NOT NULL,
  `how` varchar(255) NOT NULL,
  `ts` datetime NOT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



--
-- Struttura della tabella `percorso`
--

CREATE TABLE `percorso` (
  `id` int(11) NOT NULL,
  `desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `percorso`
--

INSERT INTO `percorso` (`id`, `desc`) VALUES
(1, 'Tre salite');

-- --------------------------------------------------------

--
-- Struttura della tabella `segmento`
--

CREATE TABLE `segmento` (
  `id` int(11) NOT NULL,
  `start` varchar(255) NOT NULL,
  `stop` varchar(255) NOT NULL,
  `descr` varchar(255) NOT NULL,
  `per_id` int(11) NOT NULL,
  `progr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `segmento`
--

INSERT INTO `segmento` (`id`, `start`, `stop`, `descr`, `per_id`, `progr`) VALUES
(1, 'Via Siepelunga, 2 Bologna', 'Via Santa Liberata Bologna', 'Monte Donato', 1, 10),
(2, 'via del genio 3 bologna', 'via di gaibola 6 bologna', 'via Del Genio', 1, 20),
(4, '44.489623,11.309306', '44.479385,11.296335', 'San Luca', 1, 30);

-- --------------------------------------------------------

--
-- Struttura della tabella `stato`
--

CREATE TABLE `stato` (
  `who` varchar(10) NOT NULL,
  `id` int(11) NOT NULL,
  `what` varchar(10) NOT NULL,
  `how` varchar(255) NOT NULL,
  `ts` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `stato`
--

INSERT INTO `stato` (`who`, `id`, `what`, `how`, `ts`) VALUES
('gb', 0, 'v', '0', CURRENT_TIMESTAMP),
('wc', 0, 'p', '0', CURRENT_TIMESTAMP),
('gb', 0, 'a', '000', CURRENT_TIMESTAMP),
('wc', 0, 'lat', '44.493733',  CURRENT_TIMESTAMP),
('wc', 0, 'lng', '11.342990',  CURRENT_TIMESTAMP),
('wc', 0, 'pov', '000',  CURRENT_TIMESTAMP),
('wc', 0, 'hdng', '000',  CURRENT_TIMESTAMP),
('wc', 0, 'dir', 'f',  CURRENT_TIMESTAMP);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`conf_key`);

--
-- Indici per le tabelle `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `logstato`
--
ALTER TABLE `logstato`
  ADD PRIMARY KEY (`log_id`);

--
-- Indici per le tabelle `percorso`
--
ALTER TABLE `percorso`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `segmento`
--
ALTER TABLE `segmento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `per_id` (`per_id`);

--
-- Indici per le tabelle `stato`
--
ALTER TABLE `stato`
  ADD PRIMARY KEY (`who`,`id`,`what`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `log`
--
ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella `logstato`
--
ALTER TABLE `logstato`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella `percorso`
--
ALTER TABLE `percorso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT per la tabella `segmento`
--
ALTER TABLE `segmento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `segmento`
--
ALTER TABLE `segmento`
  ADD CONSTRAINT `segmento_ibfk_1` FOREIGN KEY (`per_id`) REFERENCES `percorso` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
