-- =====================================================================
--  Christian Brethren Church of Papua New Guinea (CBC PNG) website
--  MySQL 8.0+ schema  (also works on MariaDB 10.6+)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS cbcpng
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SET NAMES utf8mb4;
USE cbcpng;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contact_messages, admins, news, bookshops, publications,
  gallery_images, history_events, missionaries, mission_partners,
  health_programmes, health_facility_types, education_secretaries,
  school_levels, institutions, events, youth_activities, congregations,
  provinces, leaders, church_values, ministries, stats, partnership_ways,
  ministry_contacts, settings;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- Site-wide text and contact details (key/value).
-- Every "dashed gold box" in the draft that is a single value lives here.
-- ---------------------------------------------------------------------
CREATE TABLE settings (
  setting_key   VARCHAR(80)  NOT NULL PRIMARY KEY,
  setting_value TEXT         NULL,
  label         VARCHAR(160) NOT NULL,
  group_name    VARCHAR(60)  NOT NULL DEFAULT 'General',
  input_type    ENUM('text','textarea','url','email','number','boolean') NOT NULL DEFAULT 'text',
  sort_order    INT          NOT NULL DEFAULT 0,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Number strips: home "at a glance", education, health
CREATE TABLE stats (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section     ENUM('home','education','health') NOT NULL,
  value       VARCHAR(30)  NULL,
  label       VARCHAR(80)  NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  INDEX idx_stats_section (section, sort_order)
) ENGINE=InnoDB;

-- "Our ministries" tiles on the home page
CREATE TABLE ministries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(120) NOT NULL,
  summary     VARCHAR(255) NOT NULL,
  link        VARCHAR(160) NOT NULL,
  image_url   VARCHAR(255) NULL,
  image_alt   VARCHAR(160) NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE church_values (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(80)  NOT NULL,
  description VARCHAR(255) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE leaders (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(120) NULL,
  title       VARCHAR(120) NOT NULL,
  photo_url   VARCHAR(255) NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE provinces (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE congregations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(140) NOT NULL,
  province_id     INT UNSIGNED NOT NULL,
  town            VARCHAR(120) NULL,
  contact_person  VARCHAR(120) NULL,
  phone           VARCHAR(40)  NULL,
  service_time    VARCHAR(60)  NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cong_province FOREIGN KEY (province_id)
    REFERENCES provinces(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_cong_province (province_id),
  INDEX idx_cong_name (name)
) ENGINE=InnoDB;

CREATE TABLE youth_activities (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(160) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Upcoming events (youth table on About page; can be reused for other ministries)
CREATE TABLE events (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ministry    ENUM('youth','general','mission','education','health') NOT NULL DEFAULT 'youth',
  title       VARCHAR(160) NOT NULL,
  event_date  DATE         NULL,
  date_text   VARCHAR(80)  NULL COMMENT 'Free text when exact date not yet set',
  venue       VARCHAR(160) NULL,
  INDEX idx_events_date (ministry, event_date)
) ENGINE=InnoDB;

-- Bible College & Schools table, and Training institutes table
CREATE TABLE institutions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category    ENUM('bible_college','training') NOT NULL,
  name        VARCHAR(160) NOT NULL,
  location    VARCHAR(160) NULL COMMENT 'Place and/or province',
  courses     VARCHAR(255) NULL,
  length      VARCHAR(60)  NULL,
  intake      VARCHAR(60)  NULL,
  fees        VARCHAR(60)  NULL COMMENT 'PGK',
  contact     VARCHAR(160) NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  INDEX idx_inst_cat (category, sort_order)
) ENGINE=InnoDB;

CREATE TABLE school_levels (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  level            VARCHAR(80)  NOT NULL,
  number_of_schools INT UNSIGNED NULL,
  students         INT UNSIGNED NULL,
  provinces        VARCHAR(255) NULL,
  sort_order       INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE education_secretaries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  province    VARCHAR(80)  NOT NULL,
  full_name   VARCHAR(120) NULL,
  office      VARCHAR(120) NULL,
  phone       VARCHAR(40)  NULL,
  email       VARCHAR(160) NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE health_facility_types (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  facility_type VARCHAR(80)  NOT NULL,
  number       INT UNSIGNED NULL,
  provinces    VARCHAR(255) NULL,
  sort_order   INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE health_programmes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(160) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE mission_partners (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(160) NOT NULL,
  country     VARCHAR(80)  NULL,
  website     VARCHAR(255) NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Only rows with public_consent = 1 are shown on the website.
CREATE TABLE missionaries (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(120) NOT NULL,
  country         VARCHAR(80)  NULL,
  ministry        VARCHAR(160) NULL,
  photo_url       VARCHAR(255) NULL,
  public_consent  TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order      INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE history_events (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  year_label  VARCHAR(20)  NULL,
  description VARCHAR(255) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Photos for galleries: youth, history archives, CBM covers, home hero
CREATE TABLE gallery_images (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section     ENUM('hero','youth','history','cbm','contact') NOT NULL,
  caption     VARCHAR(160) NOT NULL,
  image_url   VARCHAR(255) NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  INDEX idx_gallery_section (section, sort_order)
) ENGINE=InnoDB;

-- CBM "What we publish"
CREATE TABLE publications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(160) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE bookshops (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(140) NOT NULL,
  town        VARCHAR(140) NULL COMMENT 'Town, province',
  address     VARCHAR(255) NULL,
  phone       VARCHAR(40)  NULL,
  hours       VARCHAR(120) NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE partnership_ways (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  text        VARCHAR(255) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Contact page "Ministry contacts"
CREATE TABLE ministry_contacts (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ministry    VARCHAR(80)  NOT NULL,
  contact     VARCHAR(200) NULL,
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE news (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(220) NOT NULL UNIQUE,
  summary       VARCHAR(400) NOT NULL,
  body          MEDIUMTEXT   NULL,
  image_url     VARCHAR(255) NULL,
  image_alt     VARCHAR(160) NULL,
  published_at  DATE         NULL,
  is_published  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_pub (is_published, published_at)
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NULL,
  phone       VARCHAR(40)  NULL,
  subject     VARCHAR(160) NOT NULL,
  message     TEXT         NOT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  ip_address  VARCHAR(45)  NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_msg_read (is_read, created_at)
) ENGINE=InnoDB;

CREATE TABLE admins (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(120) NOT NULL,
  email          VARCHAR(160) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  last_login_at  TIMESTAMP    NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
