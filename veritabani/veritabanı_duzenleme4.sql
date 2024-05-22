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
    IS_TEMPLATE = False;-- Kullanıcı Tablosu
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
--SELECT setval('surveys_id_seq', 1);

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
--SELECT setval('questions_id_seq', 1);

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


-- Önce mevcut dış anahtar kısıtını silmek isteyebiliriz
ALTER TABLE question_options DROP CONSTRAINT IF EXISTS fk_question_id;


-- Daha sonra yeni dış anahtar kısıtını ekleyebiliriz
ALTER TABLE question_options 
ADD CONSTRAINT fk_question_id 
FOREIGN KEY (question_id) 
REFERENCES questions(id);


--YENİ EKLEDİM

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

-- Sorular Tablosu
SELECT * FROM question_options;

-- Kullanıcı Anket Cevapları Tablosu
SELECT * FROM user_survey_answers;

-- Kullanıcı Açık Uçlu Soru Cevapları Tablosu
SELECT * FROM user_open_answers;


--deneme
--INSERT INTO surveys (survey_name, admin_id) VALUES ('Yeni Anket', 5);
--INSERT INTO questions (survey_id, question_text, question_type) VALUES (1, 'Bu bir deneme sorusudur?', 'Metin Girişi');

--INSERT INTO surveys (survey_name, admin_id) VALUES ('Yeni Anket2', 5);

-- Soru eklemek için örnek bir SQL komutu
--INSERT INTO questions (survey_id, question_text, question_type, question_option_id)
--VALUES (2, 'Hangisi bir meyve değildir?', 'Çoktan Seçmeli',2);
		
-- Dört yeni seçenek eklemek için örnek SQL komutları
--INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
--VALUES 
  --  (2, 'Elma', 'b', false),
   -- (2, 'Armut', 'c', false),
   -- (2, 'Portakal', 'd', false),
   -- (2, 'Domates', 'e', true);
	
	
	
-- Anket oluşturma
INSERT INTO surveys (survey_name, admin_id) VALUES ('Yeni Anket Bu', 5);

-- Soru oluşturma
INSERT INTO questions (survey_id, question_text, question_type)
VALUES (3, 'Hangisi bir meyve değildir?', 'Çoktan Seçmeli');

-- Eklenen sorunun id'sini almak için
--SELECT id FROM questions WHERE question_text = 'Hangisi bir meyve değildir?';

-- Bu id ile soru seçeneklerini ekleyin
INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (1, 'Elma', 'a', false),
    (1, 'Armut', 'b', false),
    (1, 'Portakal', 'c', false),
    (1, 'Domates', 'd', true);
	
	
DELETE FROM surveys;
DELETE FROM questions;
DELETE FROM question_options;

----------------------------
--ASIL ANKET SORULARI OLUŞTURMA
INSERT INTO surveys (survey_name, admin_id) VALUES ('NEÜ Çoktan Seçmeli Anket Sorulari', 5);

-- Soru oluşturma
INSERT INTO questions (survey_id, question_text, question_type)
VALUES (2, 'Geri Al komutunun kısa yolu aşağıdaki seçeneklerden hangisinde doğru olarak verilmiştir?', 'Çoktan Seçmeli');



INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (2, 'CTRL + Y', 'a', false),
    (2, 'CTRL + Z', 'b', true),
    (2, 'CTRL + V', 'c', false),
    (2, 'CTRL + S', 'd', false),
    (2, 'ALT+CTRL+A', 'e', false);

INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (2, 'CTRL + F', 'f', false);

select*from question_options Where question_id=2

SELECT qo.id AS question_option_id, q.survey_id, qo.question_id, qo.option_text, qo.option_letter, qo.is_correct
FROM question_options qo
JOIN questions q ON qo.question_id = q.id
JOIN surveys s ON q.survey_id = s.id;


-- 2. Soru oluşturma
INSERT INTO questions (survey_id, question_text, question_type)
VALUES (2, 'Aşağıdakilerden hangisi Ekle menüsünden eklenemez?', 'Çoktan Seçmeli');
select*from questions



INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (3, 'Dosya', 'a', true),
    (3, 'Satır', 'b', false),
    (3, 'Grafik', 'c', false),
    (3, 'Köprü', 'd', false),
    (3, 'Ekran görüntüsü', 'e', false);
	


14.=B4+B5+B6+B7 formülünün eşdeğeri aşağıdakilerden hangisidir?
A) =Topla(B4;B7)
B) =Topla(B4,B7)
C) =Topla(B4:B7)
D) Toplama(B4:B7)
E) Toplama(B4;B7)
CEVAP (C)
-- 3. Soru oluşturma
INSERT INTO questions (survey_id, question_text, question_type)
VALUES (2, '=B4+B5+B6+B7 formülünün eşdeğeri aşağıdakilerden hangisidir?', 'Çoktan Seçmeli');
select*from questions



INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (4, '=Topla(B4;B7)', 'a', false),
    (4, '=Topla(B4,B7)', 'b', false),
    (4, '=Topla(B4:B7)', 'c', true),
    (4, 'Toplama(B4:B7)', 'd', false),
    (4, 'Toplama(B4;B7)', 'e', false);
	
-- 4. Soru oluşturma
18. Aşağıdakilerden hangisi doğrudur?
A) Formüllerde boşluk yerine (““) kullanılır.
B) Formüller = (eşittir) işareti ile başlar.
C) İşlev sihirbazı ( fx ) yardımı ile formül oluşturmak mümkün değildir.
D) Formüller # işareti ile başlar.
E) Formüller & işareti ile başlar
CEVAP: B

INSERT INTO questions (survey_id, question_text, question_type)
VALUES (2, 'Aşağıdakilerden hangisi doğrudur?', 'Çoktan Seçmeli');
select*from questions



INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (5, 'Formüllerde boşluk yerine (““) kullanılır.', 'a', false),
    (5, 'Formüller = (eşittir) işareti ile başlar.', 'b', true),
    (5, 'İşlev sihirbazı ( fx ) yardımı ile formül oluşturmak mümkün değildir.', 'c', false),
    (5, 'Formüller # işareti ile başlar.', 'd', false),
    (5, 'Formüller & işareti ile başlar.', 'e', false);
	
	
-- 5. Soru oluşturma
18. Aşağıdakilerden hangisi doğrudur?
A) Formüllerde boşluk yerine (““) kullanılır.
B) Formüller = (eşittir) işareti ile başlar.
C) İşlev sihirbazı ( fx ) yardımı ile formül oluşturmak mümkün değildir.
D) Formüller # işareti ile başlar.
E) Formüller & işareti ile başlar
CEVAP: B

INSERT INTO questions (survey_id, question_text, question_type)
VALUES (2, 'E6 hücresindeki sayıdan E4 hücresinde bulunan sayıyı çıkartıp sonucu ikiye bölen formül aşağıdakilerden hangisidir?', 'Çoktan Seçmeli');
select*from questions




INSERT INTO question_options (question_id, option_text, option_letter, is_correct)
VALUES 
    (6, '=E6-E4/2', 'a', false),
    (6, '=(E6-E4)/2', 'b', true),
    (6, '=(E6-E4):/2', 'c', false),
    (6, '=(E6:E4)/2', 'd', false),
    (6, '=(E4-E6)/2', 'e', false);
	
	