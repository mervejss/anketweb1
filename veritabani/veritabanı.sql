CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);


SELECT * FROM users;
SELECT * FROM admins;
SELECT * FROM surveys;
SELECT * FROM admin_permissions;
SELECT * FROM questions;
SELECT * FROM user_open_answers;
SELECT * FROM user_survey_answers;

-- Yönetici Tablosu
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
  -- Diğer yönetici bilgileri eklenebilir
);

SELECT * FROM admins;

-- Anketler Tablosu
CREATE TABLE surveys (
  id SERIAL PRIMARY KEY,
  survey_name VARCHAR(255) NOT NULL,
  admin_id INTEGER REFERENCES admins(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM surveys;

-- Yönetici İzinleri Tablosu
CREATE TABLE admin_permissions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admins(id),
  survey_id INTEGER REFERENCES surveys(id),
  permission_level VARCHAR(50) -- Örneğin: düzenleme, silme yetkisi gibi
);
SELECT * FROM admin_permissions;



-- Sorular Tablosu
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER REFERENCES surveys(id),
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM questions;

-- Kullanıcı Anket Cevapları Tablosu
CREATE TABLE user_survey_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  survey_id INTEGER REFERENCES surveys(id),
  answers TEXT,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM user_survey_answers;

-- Kullanıcı Açık Uçlu Soru Cevapları Tablosu
CREATE TABLE user_open_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  answer_text_or_file TEXT,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM user_open_answers;


