-- =====================================================================
--  CBC PNG starting content, taken from the approved draft.
--  NULL values show on the site as a dashed "to be confirmed" box,
--  exactly like the draft, until leaders fill them in from /admin.
-- =====================================================================
SET NAMES utf8mb4;
USE cbcpng;

INSERT INTO settings (setting_key, setting_value, label, group_name, input_type, sort_order) VALUES
-- General
('site_name', 'Christian Brethren Church of Papua New Guinea', 'Church name', 'General', 'text', 1),
('show_draft_notice', '1', 'Show the "draft" banner at the top of every page', 'General', 'boolean', 2),
('draft_notice', 'Draft for National Executive approval. Details in dashed gold boxes must be supplied and confirmed by CBC PNG leaders before the site goes public.', 'Draft banner text', 'General', 'textarea', 3),
('facebook_url', 'https://www.facebook.com/groups/cbcpng/', 'Facebook link', 'General', 'url', 4),
-- Home
('hero_greeting', 'Welkam! Wanpela famili long Krais.', 'Greeting (Tok Pisin)', 'Home page', 'text', 10),
('hero_title', 'One family in Christ, serving all of Papua New Guinea', 'Main heading', 'Home page', 'text', 11),
('province_count', NULL, 'Number of provinces the church is in', 'Home page', 'number', 12),
('founded_year', NULL, 'Year the church began', 'Home page', 'number', 13),
-- Head office
('office_address', NULL, 'Street address (street, town, province)', 'Head office', 'text', 20),
('office_postal', NULL, 'Postal address (PO Box, town, province)', 'Head office', 'text', 21),
('office_phone', NULL, 'Phone', 'Head office', 'text', 22),
('office_email', NULL, 'Email', 'Head office', 'email', 23),
('office_hours', NULL, 'Office hours (e.g. Mon–Fri, 8:00 am – 4:00 pm)', 'Head office', 'text', 24),
('map_embed_url', NULL, 'Google Maps embed link (Share → Embed a map → copy the src link)', 'Head office', 'url', 25),
-- Beliefs
('vision', 'A Christ-centred church in every community of Papua New Guinea, transforming lives through the Word of God.', 'Vision', 'Vision & Mission', 'textarea', 30),
('vision_confirmed', '0', 'Vision wording is officially approved', 'Vision & Mission', 'boolean', 31),
('mission', 'To glorify God by making disciples of Jesus Christ through faithful Bible teaching, worship and fellowship; by equipping leaders; and by serving our nation through education, health care and Christian literature.', 'Mission', 'Vision & Mission', 'textarea', 32),
('mission_confirmed', '0', 'Mission wording is officially approved', 'Vision & Mission', 'boolean', 33),
('values_confirmed', '0', 'Values list is officially approved', 'Vision & Mission', 'boolean', 34),
('statement_of_faith', NULL, 'Statement of faith (word for word, as approved by the National Executive)', 'Vision & Mission', 'textarea', 35),
-- Church
('church_led_by', NULL, 'Each congregation is led by (e.g. elders / pastors)', 'The Church', 'text', 40),
('church_governed_by', NULL, 'National church is guided by (e.g. General Assembly / National Executive)', 'The Church', 'text', 41),
-- Youth
('youth_intro', 'CBC Youth helps young people know Christ, grow in God’s Word and serve their communities.', 'Youth introduction', 'Youth', 'textarea', 50),
('youth_coordinator_name', NULL, 'National youth coordinator name', 'Youth', 'text', 51),
('youth_coordinator_phone', NULL, 'Youth coordinator phone', 'Youth', 'text', 52),
('youth_coordinator_email', NULL, 'Youth coordinator email', 'Youth', 'email', 53),
('youth_coordinator_photo', NULL, 'Youth coordinator photo link', 'Youth', 'url', 54),
-- Bible college
('bible_college_name', NULL, 'Name of Bible College', 'Bible College', 'text', 60),
('bible_college_location', NULL, 'Bible College place and province', 'Bible College', 'text', 61),
('how_to_apply', NULL, 'How to apply (entry requirements, forms, closing dates, contact)', 'Bible College', 'textarea', 62),
-- Mission
('mission_intro', 'CBC PNG works with partner churches and mission bodies overseas, and sends its own missionaries to serve beyond Papua New Guinea.', 'Overseas mission introduction', 'Overseas Mission', 'textarea', 70),
('mission_prayer_points', NULL, 'Current prayer points (one per line)', 'Overseas Mission', 'textarea', 71),
-- History
('history_intro', 'How God planted and grew the Christian Brethren Church in Papua New Guinea.', 'History introduction', 'History', 'textarea', 80),
('pioneers', NULL, 'Pioneers: names and short stories (missionaries and Papua New Guinean leaders)', 'History', 'textarea', 81),
-- Training / education / health
('training_intro', 'Our training institutes prepare pastors, teachers, health workers and community leaders who serve with skill and Christian character.', 'Training introduction', 'Training & Services', 'textarea', 90),
('education_intro', 'CBC PNG is a church education agency working in partnership with the National Department of Education.', 'Education introduction', 'Training & Services', 'textarea', 91),
('health_intro', 'CBC Health Services cares for the whole person in rural and remote communities, in partnership with the National Department of Health and Provincial Health Authorities.', 'Health introduction', 'Training & Services', 'textarea', 92),
('health_secretary_name', NULL, 'Health Secretary name', 'Training & Services', 'text', 93),
('health_secretary_phone', NULL, 'Health Secretary phone', 'Training & Services', 'text', 94),
('health_secretary_email', NULL, 'Health Secretary email', 'Training & Services', 'email', 95),
-- CBM
('cbm_full_name', NULL, 'CBM full name', 'Publication', 'text', 100),
('cbm_languages', NULL, 'Local languages CBM publishes in', 'Publication', 'text', 101),
('how_to_order', NULL, 'How to order (payment, delivery to provinces, CBM phone and email)', 'Publication', 'textarea', 102),
('bookshops_intro', 'Visit a CBC bookshop for Bibles, Christian books, school supplies and church resources.', 'Bookshops introduction', 'Publication', 'textarea', 103),
-- Give
('bank_name', NULL, 'Bank (BSP / Kina Bank / other)', 'Giving', 'text', 110),
('bank_account_name', NULL, 'Account name', 'Giving', 'text', 111),
('bank_account_number', NULL, 'Account number', 'Giving', 'text', 112),
('bank_branch', NULL, 'Branch', 'Giving', 'text', 113),
('bank_reference', NULL, 'Reference to use (e.g. ministry name)', 'Giving', 'text', 114),
('bank_details_approved', '0', 'Bank details approved by church finance (bank details stay hidden until ticked)', 'Giving', 'boolean', 115),
('overseas_giving', NULL, 'Giving from overseas (SWIFT code, transfer details or partner agencies)', 'Giving', 'textarea', 116),
('finance_office', NULL, 'Office responsible for receiving gifts', 'Giving', 'text', 117),
('partnership_contact', NULL, 'Partnership contact (name, email)', 'Giving', 'text', 118);

INSERT INTO stats (section, value, label, sort_order) VALUES
('home', NULL, 'congregations', 1), ('home', NULL, 'provinces', 2), ('home', NULL, 'schools', 3),
('home', NULL, 'health facilities', 4), ('home', NULL, 'bookshops', 5),
('education', NULL, 'schools', 1), ('education', NULL, 'students', 2), ('education', NULL, 'teachers', 3),
('education', NULL, 'Church Education Secretaries', 4),
('health', NULL, 'health facilities', 1), ('health', NULL, 'health workers', 2), ('health', NULL, 'patients a year', 3);

INSERT INTO ministries (title, summary, link, image_alt, sort_order) VALUES
('Youth Ministries', 'Helping young people know Christ and serve their communities.', '/about#youth', 'Youth convention', 1),
('Bible College & Schools', 'Training pastors, evangelists and church workers.', '/about#college', 'Bible college students', 2),
('Education', 'CBC schools across the provinces, from elementary to secondary.', '/services#education', 'CBC school classroom', 3),
('Health Services', 'Caring for the whole person in rural and remote communities.', '/services#health', 'Health worker at a rural clinic', 4),
('Overseas Mission', 'Sending and partnering for the gospel beyond PNG.', '/about#mission', 'Missionaries with partner church', 5),
('Bookshops Nationwide', 'Bibles and Christian resources within reach of every family.', '/publication#bookshops', 'CBC bookshop shelves', 6);

INSERT INTO church_values (title, description, sort_order) VALUES
('Scripture', 'The Bible is our final authority for faith and life.', 1),
('Every believer serves', 'All God’s people share in ministry.', 2),
('Prayer', 'We depend on God in everything.', 3),
('Servant leadership', 'Leaders serve as Christ served.', 4),
('Unity', 'One body in Christ across every tribe and language.', 5),
('Compassion', 'We care for the whole person.', 6);

INSERT INTO leaders (full_name, title, sort_order) VALUES
(NULL, 'National Chairman / President', 1),
(NULL, 'General Secretary', 2),
(NULL, 'National Treasurer', 3),
(NULL, 'Title to confirm', 4);

INSERT INTO provinces (name) VALUES
('Autonomous Region of Bougainville'), ('Central'), ('Chimbu (Simbu)'), ('East New Britain'),
('East Sepik'), ('Eastern Highlands'), ('Enga'), ('Gulf'), ('Hela'), ('Jiwaka'), ('Madang'),
('Manus'), ('Milne Bay'), ('Morobe'), ('National Capital District'), ('New Ireland'),
('Northern (Oro)'), ('Southern Highlands'), ('West New Britain'), ('West Sepik (Sandaun)'),
('Western'), ('Western Highlands');

-- Congregations: intentionally empty. Add every congregation from /admin.

INSERT INTO youth_activities (title, sort_order) VALUES
('Weekly youth fellowships', 1), ('Camps and national youth conventions', 2),
('Bible quizzes and Sunday school', 3), ('Sports outreach', 4), ('Leadership training', 5);

INSERT INTO events (ministry, title, event_date, date_text, venue) VALUES
('youth', 'National Youth Convention', NULL, NULL, NULL);

INSERT INTO institutions (category, name, location, courses, length, intake, fees, contact, sort_order) VALUES
('bible_college', 'Bible College (name to confirm)', NULL, 'Certificate in Ministry', '1 year', NULL, NULL, NULL, 1),
('bible_college', 'Bible College (name to confirm)', NULL, 'Diploma in Theology', '3 years', NULL, NULL, NULL, 2),
('bible_college', 'Other Bible school', NULL, NULL, NULL, NULL, NULL, NULL, 3),
('training', 'Bible College', NULL, NULL, NULL, NULL, NULL, NULL, 1),
('training', 'Vocational or lay training centre', NULL, NULL, NULL, NULL, NULL, NULL, 2),
('training', 'Health worker training school', NULL, NULL, NULL, NULL, NULL, NULL, 3);

INSERT INTO school_levels (level, sort_order) VALUES
('Elementary', 1), ('Primary', 2), ('Secondary / High', 3), ('Technical / Vocational', 4);

INSERT INTO education_secretaries (province, sort_order) VALUES
('Province to confirm', 1), ('Province to confirm', 2), ('Province to confirm', 3);

INSERT INTO health_facility_types (facility_type, sort_order) VALUES
('Hospital', 1), ('Health centre', 2), ('Aid post / Community Health Post', 3);

INSERT INTO health_programmes (title, sort_order) VALUES
('Maternal and child health', 1), ('TB and HIV care', 2), ('Malaria prevention', 3), ('Immunisation', 4);

INSERT INTO mission_partners (name, country, sort_order) VALUES
('Partner mission or church (to confirm)', NULL, 1),
('Partner mission or church (to confirm)', NULL, 2),
('Partner mission or church (to confirm)', NULL, 3);

-- Missionaries: add from /admin. Only those with public_consent = 1 are shown.

INSERT INTO history_events (year_label, description, sort_order) VALUES
(NULL, 'First Brethren missionaries arrive at (place to confirm).', 1),
(NULL, 'First congregations formed at (places to confirm).', 2),
(NULL, 'Bible College founded.', 3),
(NULL, 'Church schools and health work begin.', 4),
(NULL, 'National church becomes locally led under (first national leader to confirm).', 5),
(NULL, 'Key milestone to today (to confirm).', 6);

INSERT INTO gallery_images (section, caption, sort_order) VALUES
('hero', 'A CBC congregation worshipping together', 1),
('youth', 'Youth camp', 1), ('youth', 'Youth sports outreach', 2),
('history', 'Early mission station', 1), ('history', 'First church building', 2),
('history', 'Early graduates', 3), ('history', 'Pioneers', 4),
('cbm', 'Featured book cover', 1), ('cbm', 'Featured book cover', 2), ('cbm', 'Featured book cover', 3);

INSERT INTO publications (title, sort_order) VALUES
('Bibles and New Testaments', 1), ('Sunday school materials', 2),
('Discipleship and Bible study books', 3), ('Hymn books', 4), ('School books', 5);

INSERT INTO bookshops (name, sort_order) VALUES
('Bookshop (name to confirm)', 1), ('Bookshop (name to confirm)', 2), ('Bookshop (name to confirm)', 3);

INSERT INTO partnership_ways (text, sort_order) VALUES
('Pray for our churches, schools and health workers.', 1),
('Volunteer as a teacher, health worker or trainer.', 2),
('Sponsor a Bible college student or a school project.', 3),
('Partner as a church or mission agency.', 4);

INSERT INTO ministry_contacts (ministry, contact, sort_order) VALUES
('Youth', NULL, 1), ('Bible College', NULL, 2), ('Education', NULL, 3),
('Health', NULL, 4), ('CBM', NULL, 5);

INSERT INTO news (title, slug, summary, body, published_at, is_published) VALUES
('National Youth Convention announced', 'national-youth-convention-announced',
 'Venue, dates and how to register.', 'Full story to be written: venue, dates, speakers and how to register.', NULL, 1),
('Bible College graduation', 'bible-college-graduation',
 'Names of graduates and where they will serve.', 'Full story to be written: names of graduates and where they will serve.', NULL, 1),
('New health centre opened', 'new-health-centre-opened',
 'Location and the communities it will serve.', 'Full story to be written: location and the communities it will serve.', NULL, 1);

-- The first admin account is created with:  npm run create-admin   (in /server)
