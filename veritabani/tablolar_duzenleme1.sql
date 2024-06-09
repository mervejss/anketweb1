-- Database: anketweb

-- DROP DATABASE IF EXISTS anketweb;

CREATE DATABASE anketweb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
-- Kullanıcı Tablosu
CREATE TABLE users (
  id SERIAL PRIMARY KEY, -- Kullanıcıların benzersiz kimlik numarası
  first_name VARCHAR(255) NOT NULL, -- Kullanıcının adı
  last_name VARCHAR(255) NOT NULL, -- Kullanıcının soyadı
  phone_number VARCHAR(20) NOT NULL, -- Kullanıcının telefon numarası
  email VARCHAR(255) NOT NULL, -- Kullanıcının e-posta adresi
  password VARCHAR(255) NOT NULL -- Kullanıcının şifresi
);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY, -- Yöneticilerin benzersiz kimlik numarası
  first_name VARCHAR(255) NOT NULL, -- Yöneticinin adı
  last_name VARCHAR(255) NOT NULL, -- Yöneticinin soyadı
  phone_number VARCHAR(20) NOT NULL,-- Yöneticinin telefon numarası
  email VARCHAR(255) NOT NULL,
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


--YENİ EKLEDİM 
-- Seçenekler Tablosu
CREATE TABLE question_options (
  id SERIAL PRIMARY KEY, -- Seçeneğin benzersiz kimlik numarası
  question_id INTEGER REFERENCES questions(id), -- Seçeneğin bağlı olduğu sorunun kimlik numarası
  option_text TEXT NOT NULL, -- Seçeneğin metin içeriği
  option_letter CHAR(1), -- Seçeneğin harfle temsil edilen kısa formu (örneğin: a, b, c, d)
  is_correct BOOLEAN DEFAULT FALSE, -- Seçeneğin doğru olup olmadığını belirten bayrak
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Seçeneğin son güncellenme zamanı
);



CREATE TABLE user_survey_answers (
  id SERIAL PRIMARY KEY, -- Kullanıcı cevaplarının benzersiz kimlik numarası
  user_id INTEGER REFERENCES users(id), -- Cevabı veren kullanıcının kimlik numarası
  survey_id INTEGER REFERENCES surveys(id), -- Cevap verilen anketin kimlik numarası
  question_id INTEGER REFERENCES questions(id), -- Seçeneğin bağlı olduğu sorunun kimlik numarası
  question_option_id INTEGER REFERENCES question_options(id),
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

-- Sorular Tablosu
SELECT * FROM question_options;

-- Kullanıcı Anket Cevapları Tablosu
SELECT * FROM user_survey_answers;

-- Kullanıcı Açık Uçlu Soru Cevapları Tablosu
SELECT * FROM user_open_answers;

DELETE FROM user_survey_answers;

CREATE TABLE user_survey_answers (
  id SERIAL PRIMARY KEY, -- Kullanıcı cevaplarının benzersiz kimlik numarası
  user_id INTEGER REFERENCES users(id), -- Cevabı veren kullanıcının kimlik numarası
  survey_id INTEGER REFERENCES surveys(id), -- Cevap verilen anketin kimlik numarası
  question_id INTEGER REFERENCES questions(id), -- Seçeneğin bağlı olduğu sorunun kimlik numarası
  question_option_id INTEGER REFERENCES question_options(id),
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Cevabın verildiği zaman
);

-- Kullanıcı Açık Uçlu Soru Cevapları Tablosu
CREATE TABLE user_open_answers (
  id SERIAL PRIMARY KEY, -- Kullanıcının açık uçlu sorulara verdiği cevapların benzersiz kimlik numarası
  user_id INTEGER REFERENCES users(id), -- Cevabı veren kullanıcının kimlik numarası
  survey_id INTEGER REFERENCES surveys(id), -- Cevap verilen anketin kimlik numarası
	question_id INTEGER REFERENCES questions(id), -- Cevaplanan açık uçlu sorunun kimlik numarası
  answer TEXT, -- Kullanıcının verdiği metin veya dosya içeriği
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Cevabın verildiği zaman
);

SELECT * FROM user_open_answers;


-- Kullanıcı Aktivite Logları Tablosu
CREATE TABLE user_activity_logs (
  id SERIAL PRIMARY KEY, -- Log kayıtlarının benzersiz kimlik numarası
  user_id INTEGER REFERENCES users(id), -- Aktiviteyi gerçekleştiren kullanıcının kimlik numarası
  action VARCHAR(50) NOT NULL, -- Kullanıcının gerçekleştirdiği eylem (örneğin: giriş, çıkış, aşama değişikliği ,video izleme)
  stage INTEGER, -- Kullanıcının bulunduğu aşama (1,2,3,4,5)
  video_1_watched BOOLEAN DEFAULT FALSE, -- Kullanıcının 2. aşamadaki ilk videoyu izleyip izlemediği
  video_2_watched BOOLEAN DEFAULT FALSE, -- Kullanıcının 3. aşamadaki ikinci videoyu izleyip izlemediği
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Aktivitenin gerçekleştirildiği zaman
);

SELECT * FROM user_activity_logs;

DELETE FROM user_activity_logs;

SELECT * FROM user_open_answers;


DELETE FROM user_open_answers;


