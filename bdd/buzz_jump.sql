-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : jeu. 06 fév. 2025 à 12:54
-- Version du serveur : 5.7.44
-- Version de PHP : 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `buzz_jump`
--

-- --------------------------------------------------------

--
-- Structure de la table `highscores`
--

CREATE TABLE `highscores` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `date_score` datetime NOT NULL,
  `pseudo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `highscores`
--

INSERT INTO `highscores` (`id`, `email`, `score`, `date_score`, `pseudo`) VALUES
(2, 'julien@gmail.com', 220, '2025-01-27 09:54:23', 'Julien'),
(3, 'Flo@gmail.com', 120, '2025-01-27 15:08:30', 'Flo');

-- --------------------------------------------------------

--
-- Structure de la table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `email` varchar(100) NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `highscore` int(11) DEFAULT '0',
  `date_score` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`email`, `pseudo`, `highscore`, `date_score`, `password`) VALUES
('Flo@gmail.com', 'Flo', 120, '2025-01-27 15:08:30', '$2y$10$rNG6uT3HGyWJR98FVP3ge.LTzUzCEoju5BFpAXcYlB1oXVKCzD.Hm'),
('julien@gmail.com', 'Julien', 220, '2025-01-27 09:54:23', '$2y$10$fWcPfPpK6dBGXJ7nTFTWl.vZ8k6H6FHJnQlJXloigieCOc5GQ2NWO'),
('morgane@gmail.com', 'Morgane', 0, NULL, '$2y$10$Tsss95wP4pjmZcWVZ2JaBO47TwdBkjs9zYcv/E30O4zAdsCGaeqMu');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `highscores`
--
ALTER TABLE `highscores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- Index pour la table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `highscores`
--
ALTER TABLE `highscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `highscores`
--
ALTER TABLE `highscores`
  ADD CONSTRAINT `highscores_ibfk_1` FOREIGN KEY (`email`) REFERENCES `utilisateurs` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
