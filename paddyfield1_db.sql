-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2026 at 04:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paddyfield1_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `crops`
--

CREATE TABLE `crops` (
  `id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `crop_name` varchar(100) NOT NULL,
  `variety` varchar(100) DEFAULT NULL,
  `season` varchar(100) DEFAULT NULL,
  `planting_date` date DEFAULT NULL,
  `expected_harvest_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Planted',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crops`
--

INSERT INTO `crops` (`id`, `field_id`, `crop_name`, `variety`, `season`, `planting_date`, `expected_harvest_date`, `status`, `created_at`) VALUES
(2, 2, 'rice', 'bg352', 'Maha', '2026-02-10', '2027-12-01', 'Planted', '2026-10-01 16:35:22'),
(3, 3, 'rice', 'bg352', 'Yala', '2026-03-10', '2027-01-06', 'Growing', '2026-10-02 08:43:53'),
(4, 5, 'Tomato', '--', 'Other', '2026-01-09', '2027-01-03', 'Planted', '2026-10-04 07:51:08'),
(5, 4, 'Potato', '--', 'Yala', '2026-03-10', '2027-01-04', 'Growing', '2026-10-04 07:52:44'),
(6, 8, 'Tomato', 'BG 352', 'Yala', '2026-04-10', '0000-00-00', 'Planted', '2026-10-05 05:33:02'),
(7, 6, 'Pumpkin', 'AT 362', 'Yala', '2026-12-03', '0000-00-00', 'Growing', '2026-10-05 05:34:18');

-- --------------------------------------------------------

--
-- Table structure for table `cultivations`
--

CREATE TABLE `cultivations` (
  `id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `planting_method` varchar(100) DEFAULT NULL,
  `seed_quantity` decimal(10,2) DEFAULT NULL,
  `seed_unit` varchar(30) DEFAULT NULL,
  `planting_date` date DEFAULT NULL,
  `expected_harvest_date` date DEFAULT NULL,
  `water_schedule` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Planned',
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cultivations`
--

INSERT INTO `cultivations` (`id`, `crop_id`, `planting_method`, `seed_quantity`, `seed_unit`, `planting_date`, `expected_harvest_date`, `water_schedule`, `status`, `notes`, `created_at`) VALUES
(3, 3, '→ Direct Seeding', 12.00, 'kg', '2026-12-09', '2027-01-01', ' Every 3 days', 'Planned', '', '2026-10-02 09:41:59'),
(4, 2, '→ Direct Seeding', 12.00, 'kg', '2026-12-09', '2027-01-01', ' Every 3 days', 'Planned', '', '2026-10-02 09:42:20');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `crop_id` int(11) DEFAULT NULL,
  `expense_type` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` date NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `field_id`, `crop_id`, `expense_type`, `description`, `amount`, `expense_date`, `payment_method`, `notes`, `created_at`) VALUES
(2, 2, 2, 'Fertilizer', 'Urea', 5000.00, '2026-03-10', 'Cash', '', '2026-10-02 04:39:06'),
(3, 3, 3, 'Fertilizer', 'Urea', 5000.00, '2026-03-10', 'Cash', '', '2026-10-02 13:33:25'),
(4, 3, 2, 'Transport', 'Posparas', 5000.00, '2026-01-10', 'Bank Transfer', '', '2026-10-02 13:34:31');

-- --------------------------------------------------------

--
-- Table structure for table `farmers`
--

CREATE TABLE `farmers` (
  `id` int(11) NOT NULL,
  `farmer_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmers`
--

INSERT INTO `farmers` (`id`, `farmer_name`, `email`, `phone`, `village`, `created_at`) VALUES
(3, 'Nimal Jayasinghe', 'nimal@gmail.com', '0754567890', 'Ella', '2026-09-30 10:32:32'),
(4, 'kamal ranaweera', 'kamalra2gmail@gmail.com', '0987654321', 'badulla', '2026-09-30 14:42:33'),
(5, 'Aberathna', 'aberath123@gmail.com', '0235432187', 'NuwaraEliya', '2026-10-02 06:26:31'),
(6, 'Kusumlatha', 'kusum2@gmail.com', '0123456780', 'Hatton', '2026-10-04 07:29:22'),
(7, 'Amarasiri', 'aamara@gmail.com', '0234567819', 'NuwaraEliya', '2026-10-04 07:30:27'),
(8, 'Premasiri', 'premasiri1232@gmail.com', '0921345678', 'Welimada', '2026-10-04 07:31:35'),
(9, 'Nimal Perera', 'nimal123@gmail.com', '0711234567', 'Mahaweli Zone C', '2026-10-05 05:22:39'),
(10, 'Sunil Silva', 'suni123@gmail.com', '0789065743', 'Polonnaruwa', '2026-10-05 05:23:31'),
(11, 'Chamara Bandara', 'chamara1234@gmail.com', '0702321678', 'Ampara', '2026-10-05 05:24:23'),
(12, 'Ruwan Jayasinghe', 'ruwan@gmail.com', '0879606543', 'Anuradhapura', '2026-10-05 05:25:06'),
(13, 'Lakmal Fernando', 'lakmal@gmail.com', '0782867902', 'Kurunegala', '2026-10-05 05:25:55');

-- --------------------------------------------------------

--
-- Table structure for table `fertilizer_pesticides`
--

CREATE TABLE `fertilizer_pesticides` (
  `id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `input_type` varchar(50) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit` varchar(30) DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fertilizer_pesticides`
--

INSERT INTO `fertilizer_pesticides` (`id`, `crop_id`, `input_type`, `product_name`, `quantity`, `unit`, `application_date`, `cost`, `notes`, `created_at`) VALUES
(2, 2, 'Fertilizer', 'Urea', 15.00, 'kg', '2026-03-09', 2500.00, '', '2026-10-02 02:32:03'),
(3, 2, 'Fertilizer', 'Urea', 35.00, 'kg', '2026-03-10', 5000.00, '', '2026-10-02 12:58:00'),
(4, 4, 'Pesticide', 'Urea', 2.00, 'L', '2026-03-11', 5000.00, '', '2026-10-04 08:01:27'),
(5, 7, 'Fertilizer', 'Urea', 50.00, 'kg', '0000-00-00', 7500.00, '', '2026-10-05 05:38:45'),
(6, 6, 'Fertilizer', 'MOP', 2.00, 'L', '0000-00-00', 4000.00, '', '2026-10-05 05:41:02');

-- --------------------------------------------------------

--
-- Table structure for table `fields`
--

CREATE TABLE `fields` (
  `id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `soil_type` varchar(100) DEFAULT NULL,
  `irrigation_type` varchar(100) DEFAULT NULL,
  `current_crop` varchar(100) DEFAULT NULL,
  `planting_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fields`
--

INSERT INTO `fields` (`id`, `farmer_id`, `field_name`, `area`, `location`, `soil_type`, `irrigation_type`, `current_crop`, `planting_date`, `created_at`) VALUES
(2, 4, 'Main Field', 22.00, 'haputhle', 'csav', 'canal', 'tomato', '2026-09-30', '2026-10-01 16:10:49'),
(3, 5, 'Main Field', 1.05, 'NuwaraEliya', 'csav', 'canal', 'tomato', '2026-03-09', '2026-10-02 06:35:05'),
(4, 8, 'Pahala Kubura', 3.00, 'Welimada', 'csav', 'canal', 'Potato', '2026-01-10', '2026-10-04 07:38:11'),
(5, 7, 'Tomato Field', 2.00, 'Hatton', '', 'canal', 'Tomato', '2026-02-10', '2026-10-04 07:42:53'),
(6, 9, 'Green Valley Field', 2.50, 'Mahiyanganaya', 'Clay', 'Canal', 'Pumkin', '0000-00-00', '2026-10-05 05:28:06'),
(7, 10, 'Sunrise Field', 3.00, 'Polonnaruwa', 'Loamy', 'Rainfed', 'rice', '2026-01-10', '2026-10-05 05:29:53'),
(8, 11, 'River Side Field', 4.00, 'Ampara', 'Clay Loam', 'Tube Well', 'Potato', '2026-05-09', '2026-10-05 05:31:37');

-- --------------------------------------------------------

--
-- Table structure for table `field_monitoring`
--

CREATE TABLE `field_monitoring` (
  `id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `monitoring_date` date NOT NULL,
  `plant_height` decimal(10,2) DEFAULT NULL,
  `water_level` varchar(50) DEFAULT NULL,
  `pest_status` varchar(100) DEFAULT NULL,
  `disease_status` varchar(100) DEFAULT NULL,
  `growth_stage` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `field_monitoring`
--

INSERT INTO `field_monitoring` (`id`, `crop_id`, `monitoring_date`, `plant_height`, `water_level`, `pest_status`, `disease_status`, `growth_stage`, `notes`, `created_at`) VALUES
(2, 2, '2026-01-09', 25.00, 'Normal', 'No Pest', 'No Disease', 'Vegetative', '', '2026-10-02 02:53:01'),
(3, 3, '2026-01-10', 20.00, 'Normal', 'Medium', 'Low', 'Tillering', '', '2026-10-02 13:07:37');

-- --------------------------------------------------------

--
-- Table structure for table `harvests`
--

CREATE TABLE `harvests` (
  `id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `harvest_date` date NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(30) DEFAULT 'kg',
  `quality_grade` varchar(50) DEFAULT NULL,
  `storage_location` varchar(150) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `harvests`
--

INSERT INTO `harvests` (`id`, `crop_id`, `harvest_date`, `quantity`, `unit`, `quality_grade`, `storage_location`, `notes`, `created_at`) VALUES
(2, 2, '2026-03-10', 21.00, 'kg', 'Good', 'main store', '', '2026-10-02 05:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`) VALUES
(1, 'Admin User', 'admin@gmail.com', '123456', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `crops`
--
ALTER TABLE `crops`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Indexes for table `cultivations`
--
ALTER TABLE `cultivations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `farmers`
--
ALTER TABLE `farmers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fertilizer_pesticides`
--
ALTER TABLE `fertilizer_pesticides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farmer_id` (`farmer_id`);

--
-- Indexes for table `field_monitoring`
--
ALTER TABLE `field_monitoring`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `harvests`
--
ALTER TABLE `harvests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `crops`
--
ALTER TABLE `crops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cultivations`
--
ALTER TABLE `cultivations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `farmers`
--
ALTER TABLE `farmers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `fertilizer_pesticides`
--
ALTER TABLE `fertilizer_pesticides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `fields`
--
ALTER TABLE `fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `field_monitoring`
--
ALTER TABLE `field_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `harvests`
--
ALTER TABLE `harvests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `crops`
--
ALTER TABLE `crops`
  ADD CONSTRAINT `crops_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cultivations`
--
ALTER TABLE `cultivations`
  ADD CONSTRAINT `cultivations_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `fertilizer_pesticides`
--
ALTER TABLE `fertilizer_pesticides`
  ADD CONSTRAINT `fertilizer_pesticides_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fields`
--
ALTER TABLE `fields`
  ADD CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `field_monitoring`
--
ALTER TABLE `field_monitoring`
  ADD CONSTRAINT `field_monitoring_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `harvests`
--
ALTER TABLE `harvests`
  ADD CONSTRAINT `harvests_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
