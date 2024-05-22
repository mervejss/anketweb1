-- Kullanıcı Tablosu
CREATE TABLE users (
  id SERIAL PRIMARY KEY, -- Kullanıcıların benzersiz kimlik numarası
  first_name VARCHAR(255) NOT NULL, -- Kullanıcının adı
  last_name VARCHAR(255) NOT NULL, -- Kullanıcının soyadı
  phone_number VARCHAR(20) NOT NULL, -- Kullanıcının telefon numarası
  email VARCHAR(255) NOT NULL, -- Kullanıcının e-posta adresi
  password VARCHAR(255) NOT NULL -- Kullanıcının şifresi
);
/*
-- Yönetici Tablosundan Sütunları Sil
ALTER TABLE admins
  DROP COLUMN username,
  DROP COLUMN password;

-- Yönetici Tablosunu Güncelle
ALTER TABLE admins
  ADD COLUMN first_name VARCHAR(255) NOT NULL,
  ADD COLUMN last_name VARCHAR(255) NOT NULL,
  ADD COLUMN phone_number VARCHAR(20) NOT NULL,
  ADD COLUMN email VARCHAR(255) NOT NULL,
  ADD COLUMN password VARCHAR(255) NOT NULL;

-- Yönetici Tablosu
CREATE TABLE admins (
  id SERIAL PRIMARY KEY, -- Yöneticilerin benzersiz kimlik numarası
  username VARCHAR(255) NOT NULL, -- Yöneticinin kullanıcı adı
  password VARCHAR(255) NOT NULL -- Yöneticinin şifresi
  -- Diğer yönetici bilgileri eklenebilir
);
*/
CREATE TABLE admins (
  id SERIAL PRIMARY KEY, -- Yöneticilerin benzersiz kimlik numarası
  first_name VARCHAR(255) NOT NULL, -- Yöneticinin adı
  last_name VARCHAR(255) NOT NULL, -- Yöneticinin soyadı
  phone_number VARCHAR(20) NOT NULL,-- Yöneticinin telefon numarası
  username VARCHAR(255) NOT NULL, -- Yöneticinin kullanıcı adı
  password VARCHAR(255) NOT NULL -- Yöneticinin şifresi
  -- Diğer yönetici bilgileri eklenebilir
);
-- Anketler Tablosu
CREATE TABLE surveys (
  id SERIAL PRIMARY KEY, -- Anketlerin benzersiz kimlik numarası
  survey_name VARCHAR(255) NOT NULL, -- Anketin adı
  admin_id INTEGER REFERENCES admins(id), -- Anketi oluşturan yöneticinin kimlik numarası
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Anketin oluşturulma zamanı
);

-- Yönetici İzinleri Tablosu
CREATE TABLE admin_permissions (
  id SERIAL PRIMARY KEY, -- İzinlerin benzersiz kimlik numarası
  admin_id INTEGER REFERENCES admins(id), -- İzin verilen yöneticinin kimlik numarası
  survey_id INTEGER REFERENCES surveys(id), -- İzni verilen anketin kimlik numarası
  permission_level VARCHAR(50) -- Yönetici izin seviyesi (örneğin: düzenleme, silme yetkisi gibi)
);

-- Sorular Tablosu
CREATE TABLE questions (
  id SERIAL PRIMARY KEY, -- Soruların benzersiz kimlik numarası
  survey_id INTEGER REFERENCES surveys(id), -- Sorunun bağlı olduğu anketin kimlik numarası
  question_text TEXT NOT NULL, -- Sorunun metin içeriği
  question_type VARCHAR(50), -- Soru tipi (örneğin: çoktan seçmeli, metin girişi)
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Sorunun son güncellenme zamanı
);

-- Kullanıcı Anket Cevapları Tablosu
CREATE TABLE user_survey_answers (
  id SERIAL PRIMARY KEY, -- Kullanıcı cevaplarının benzersiz kimlik numarası
  user_id INTEGER REFERENCES users(id), -- Cevabı veren kullanıcının kimlik numarası
  survey_id INTEGER REFERENCES surveys(id), -- Cevap verilen anketin kimlik numarası
  answers TEXT, -- Kullanıcının verdiği cevaplar
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Cevabın verildiği zaman
);

-- Kullanıcı Açık Uçlu Soru Cevapları Tablosu
CREATE TABLE user_open_answers (
  id SERIAL PRIMARY KEY, -- Kullanıcının açık uçlu sorulara verdiği cevapların benzersiz kimlik numarası
  user_id INTEGER REFERENCES users(id), -- Cevabı veren kullanıcının kimlik numarası
  question_id INTEGER REFERENCES questions(id), -- Cevaplanan açık uçlu sorunun kimlik numarası
  answer_text_or_file TEXT, -- Kullanıcının verdiği metin veya dosya içeriği
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Cevabın verildiği zaman
);

-- Kullanıcı Tablosu
SELECT * FROM users;

-- Yönetici Tablosu
SELECT * FROM admins;

-- Anketler Tablosu
SELECT * FROM surveys;

-- Yönetici İzinleri Tablosu
SELECT * FROM admin_permissions;

-- Sorular Tablosu
SELECT * FROM questions;

-- Kullanıcı Anket Cevapları Tablosu
SELECT * FROM user_survey_answers;

-- Kullanıcı Açık Uçlu Soru Cevapları Tablosu
SELECT * FROM user_open_answers;


--deneme
INSERT INTO surveys (survey_name, admin_id) VALUES ('Yeni Anket', 5);
INSERT INTO questions (survey_id, question_text, question_type) VALUES (1, 'Bu bir deneme sorusudur?', 'Metin Girişi');
