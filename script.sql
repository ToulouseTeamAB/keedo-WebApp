SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database :  `keedoBook`
--

-- --------------------------------------------------------

--
--  Structure of `keedo_books` table
--

CREATE TABLE IF NOT EXISTS `keedo_books` (
  `ISBN` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` int(3) unsigned DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `picture` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure of `keedo_books_modules` table
--

CREATE TABLE IF NOT EXISTS `keedo_books_modules` (
  `ID` int(3) unsigned NOT NULL,
  `label` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Content of `keedo_books_modules` table
--

INSERT INTO `keedo_books_modules` (`ID`, `label`) VALUES
(1, 'ACADEMIC'),
(2, 'Accounting & Finance'),
(3, 'Architecture'),
(4, 'Art'),
(5, 'Business & Management'),
(7, 'Computing'),
(8, 'Engineering'),
(9, 'Law'),
(10, 'Nursing & Health'),
(11, 'Pharmacy & Life Sciences'),
(12, 'NON-ACADEMIC'),
(13, 'Biographies'),
(14, 'Fiction'),
(15, 'References & Study Guides');

-- --------------------------------------------------------

--
-- Structure of `keedo_books_own` table
--

CREATE TABLE IF NOT EXISTS `keedo_books_own` (
  `ISBN` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` bigint(20) unsigned NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `bookcondition` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure of `keedo_books_selling` table
--

CREATE TABLE IF NOT EXISTS `keedo_books_selling` (
`ID` bigint(20) unsigned NOT NULL,
  `ISBN` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sellerID` bigint(20) unsigned NOT NULL,
  `buyerID` bigint(20) unsigned NOT NULL,
  `bookCondition` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `status` varchar(13) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure of `keedo_users` table
--

CREATE TABLE IF NOT EXISTS `keedo_users` (
`ID` bigint(20) unsigned NOT NULL,
  `login` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_key` varchar(32) NOT NULL,
  `status` int(1) NOT NULL,
  `registered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Index for exported tables
--

--
-- Index of `keedo_books` table
--
ALTER TABLE `keedo_books`
 ADD PRIMARY KEY (`ISBN`), ADD KEY `FK_books_books_modules` (`module`);

--
-- Index of `keedo_books_modules` table
--
ALTER TABLE `keedo_books_modules`
 ADD PRIMARY KEY (`ID`);

--
-- Index of `keedo_books_own` table
--
ALTER TABLE `keedo_books_own`
 ADD PRIMARY KEY (`ISBN`,`user`), ADD KEY `FK_books_own_user` (`user`);

--
-- Index of `keedo_books_selling`
--
ALTER TABLE `keedo_books_selling`
 ADD PRIMARY KEY (`ID`), ADD KEY `FK_books_selling_user_seller` (`sellerID`), ADD KEY `FK_books_selling_user_buyer` (`buyerID`);

--
-- Index of `keedo_users` table
--
ALTER TABLE `keedo_users`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `user_login` (`login`), ADD UNIQUE KEY `user_email` (`email`), ADD UNIQUE KEY `api_key` (`api_key`);

--
-- AUTO_INCREMENT for exported tables
--

--
-- AUTO_INCREMENT for `keedo_books_modules` table
--
ALTER TABLE `keedo_books_modules`
MODIFY `ID` int(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for `keedo_books_selling` table
--
ALTER TABLE `keedo_books_selling`
MODIFY `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `keedo_users`
--
ALTER TABLE `keedo_users`
MODIFY `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- Constraint of exported tables
--

--
-- Constraints of `keedo_books` table
--
ALTER TABLE `keedo_books`
ADD CONSTRAINT `FK_books_books_modules` FOREIGN KEY (`module`) REFERENCES `keedo_books_modules` (`ID`);

--
-- Constraints of `keedo_books_own` table
--
ALTER TABLE `keedo_books_own`
ADD CONSTRAINT `FK_books_own_books` FOREIGN KEY (`ISBN`) REFERENCES `keedo_books` (`ISBN`),
ADD CONSTRAINT `FK_books_own_user` FOREIGN KEY (`user`) REFERENCES `keedo_users` (`ID`);

--
-- Constraints of `keedo_books_selling` table
--
ALTER TABLE `keedo_books_selling`
ADD CONSTRAINT `FK_books_selling_user_buyer` FOREIGN KEY (`buyerID`) REFERENCES `keedo_users` (`ID`),
ADD CONSTRAINT `FK_books_selling_user_seller` FOREIGN KEY (`sellerID`) REFERENCES `keedo_users` (`ID`),
ADD CONSTRAINT `FK_books_selling_isbn` FOREIGN KEY (`ISBN`) REFERENCES `keedo_books` (`ISBN`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
