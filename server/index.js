const express = require('express');
const User = require('./models/user');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const app = express();
const { Pool } = require('pg'); // pg modülünü ekledik
const cors = require('cors'); // cors modülünü ekledik
app.use(cors()); // CORS başlıklarını ekledik
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.NODE_ENV=="production"?process.env.DB_USER:"postgres",
  host: process.env.NODE_ENV=="production"?process.env.DB_HOST:"localhost",
  database: process.env.NODE_ENV=="production"?process.env.DB_DATABASE:"anketweb",
  password: process.env.NODE_ENV=="production"?process.env.DB_PASSWORD:"1234",
  port: process.env.NODE_ENV=="production"?process.env.DB_PORT:"5432", // Varsayılan PostgreSQL portu
});

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.post('/api/users', (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  //console.log(req.body)
  const { first_name, last_name, phone_number, email, password } = user;
  pool.query('INSERT INTO users (first_name, last_name, phone_number, email, password) VALUES ($1, $2, $3, $4, $5)',
    [first_name, last_name, phone_number, email, password],
    (error, results) => {
      if (error) {
         //console.error('Veritabanına kayıt eklenirken hata oluştu: ', error);
        return res.status(500).json({ status: 500, message: 'Veritabanına kayıt eklenirken hata oluştu' });
      }
      let payload = {subject: results.id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    });
});


app.post('/api/login', (req, res) => {
  let userData = req.body

  // Veritabanında kullanıcının varlığını ve şifresini kontrol et
  pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
    if (error) {
       //console.error('Veritabanı hatası: ', error);
      return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
    }

    if (user.rows.length > 0) {
      // Kullanıcı var, giriş başarılı
       //console.log('Normal Kullanici Giriş başarılı, Hoş geldiniz' + user.rows[0].id, user.rows[0].phone_number);
      let payload = {subject: user.id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})

    } else {
       //console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');

      // Kullanıcı yok veya şifre yanlış
      return res.status(401).json({ status: 401, message: 'E-posta veya şifre hatalı' });
    }
  });
});

  app.post('/api/adminlogin',(req, res) => {
    let userData = req.body
  
    // Veritabanında kullanıcının varlığını ve şifresini kontrol et
    pool.query('SELECT * FROM admins WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
      if (error) {
         //console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
  
      if (user.rows.length > 0) {
        // Kullanıcı var, giriş başarılı
         //console.log('Giriş başarılı, Hoş geldiniz' + user.rows[0].id, user.rows[0].phone_number);
        let payload = {subject: user.id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})

      } else {
         //console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');
        // Kullanıcı yok veya şifre yanlış
        return res.status(401).json({ status: 401, message: 'E-posta veya şifre hatalı' });
      }
    });
  });
app.post('/api/normalKullaniciInfo',(req, res) => {
  let userData = req.body

     // Veritabanında kullanıcının varlığını ve şifresini kontrol et
  pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
    if (error) {
       //console.error('Veritabanı hatası: ', error);
      return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
    }

    if (user.rows.length > 0) {
      // Kullanıcı var, giriş başarılı
       //console.log('Bilgiler bulundu ve getirildi : ' + user.rows[0].id,user.rows[0].first_name,user.rows[0].last_name,user.rows[0].phone_number,user.rows[0].email,user.rows[0].password);
      const userInfo = user.rows[0];

          // Değişkeni response olarak gönder
          res.status(200).send(userInfo);

    } else {
       //console.error(error);
      // Kullanıcı yok veya şifre yanlış
      return res.status(401).json({ status: 401, message: error });
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.id = payload.subject
  next()
}

app.post('/api/admins', (req, res) => {
  let userData = req.body;
  let user = new User(userData);
   //console.log(req.body)
  // Kullanıcının özelliklerine erişerek ilgili alanları al
  const { first_name, last_name, phone_number, email, password } = user;
  // Veritabanına admini kaydet
  pool.query('INSERT INTO admins (first_name, last_name, phone_number, email, password) VALUES ($1, $2, $3, $4, $5)',
    [first_name, last_name, phone_number, email, password],
    (error, results) => {
      if (error) {
         //console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
      let payload = {subject: results.id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
       //console.log('Admin başarıyla kaydedildi');
       //console.log(token);
      //return res.status(200).json({ status: 200, message: 'Admin başarıyla kaydedildi' });
    });
  })


  app.post('/api/adminlogin',(req, res) => {
    let userData = req.body
  
    // Veritabanında kullanıcının varlığını ve şifresini kontrol et
    pool.query('SELECT * FROM admins WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
      if (error) {
         //.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
  
      if (user.rows.length > 0) {
        // Kullanıcı var, giriş başarılı
         //console.log('Giriş başarılı, Hoş geldiniz' + user.rows[0].id, user.rows[0].phone_number);
        let payload = {subject: user.id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})

      } else {
         //console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');
        // Kullanıcı yok veya şifre yanlış
        return res.status(401).json({ status: 401, message: 'E-posta veya şifre hatalı' });
      }
    });
  });

  app.post('/api/admininfo',(req, res) => {
    let userData = req.body
  
       // Veritabanında kullanıcının varlığını ve şifresini kontrol et
    pool.query('SELECT * FROM admins WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
      if (error) {
         //console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
  
      if (user.rows.length > 0) {
        // Kullanıcı var, giriş başarılı
         //console.log('Bilgiler bulundu ve getirildi : ' + user.rows[0].id,user.rows[0].first_name,user.rows[0].last_name,user.rows[0].phone_number,user.rows[0].email,user.rows[0].password);
        const userInfo = user.rows[0];

            // Değişkeni response olarak gönder
            res.status(200).send(userInfo);

      } else {
         //console.error(error);
        // Kullanıcı yok veya şifre yanlış
        return res.status(401).json({ status: 401, message: error });
      }
    });
  });


  app.post('/api/questions', (req, res) => {
    const tiklananAnketId = req.body.tiklananAnketId;

    pool.query('SELECT * FROM questions WHERE survey_id = $1', [tiklananAnketId], (error, queryResult) => {
        if (error) {
            //console.error(error);
            return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
        }

        if (queryResult.rows.length > 0) {
            // Sorular bulundu, başarılı olarak döndür
            const questions = queryResult.rows;
             //console.log('Bilgiler bulundu ve getirildi : ' + questions);
            res.status(200).json(questions);
        } else {
            // console.error(error);
            // Hiçbir soru bulunamadı
            return res.status(404).json({ status: 404, message: 'Soru bulunamadı' });
        }
    });
});



app.post('/api/questionOptions', (req, res) => {
  const questionId = req.body.question_id;

  // Eğer question_id gönderilmediyse, hata döndür
  if (!questionId) {
      return res.status(400).json({ status: 400, message: 'Soru ID gereklidir' });
  }

  pool.query('SELECT * FROM question_options WHERE question_id = $1', [questionId], (error, queryResult) => {
      if (error) {
           //console.error(error);
          return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }

      if (queryResult.rows.length > 0) {
          // Seçenekler bulundu, başarılı olarak döndür
          const options = queryResult.rows;
           //console.log('OPTIONS : ' ,options);

          res.status(200).json(options);
      } else {
          // Belirtilen soru için seçenek bulunamadı
          return res.status(404).json({ status: 404, message: 'Belirtilen soru için seçenek bulunamadı' });
      }
  });
});



app.get('/usersAll', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    res.json(users);
    client.release();
  } catch (err) {
     //console.error('Error executing query', err);
    res.status(500).send('Error fetching users from database');
  }
});




// Anketleri getiren endpoint
app.get('/api/surveys', async (req, res) => {
  try {
    const sortType = req.query.sortType || 'newToOld'; // Varsayılan olarak eskiden yeniye doğru sırala
    let queryString = 'SELECT * FROM surveys';

    if (sortType === 'newToOld') {
      queryString += ' ORDER BY created_at DESC'; // Eskiden yeniye doğru sırala
    } else if (sortType === 'oldToNew') {
      queryString += ' ORDER BY created_at ASC'; // Yeniden eskiye doğru sırala
    }

    const client = await pool.connect();
    const result = await client.query(queryString);
    const surveys = result.rows;
    res.json(surveys);
    client.release();
  } catch (err) {
     //console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/api/createSurvey', async (req, res) => {
  try {
    const { survey_name, admin_id } = req.body;
    const queryText = 'INSERT INTO surveys (survey_name, admin_id) VALUES ($1, $2) RETURNING *';
    const values = [survey_name, admin_id];
    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
     //console.error('Error executing query', error);
    res.status(500).send('Error creating survey');
  }
});

app.post('/api/createQuestion', async (req, res) => {
  try {
    const { survey_id, question_text, question_type } = req.body;
    const queryText = 'INSERT INTO questions (survey_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING *';
    const values = [survey_id, question_text, question_type];
    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
     //console.error('Error executing query', error);
    res.status(500).send('Error creating question');
  }
});

// Soruyu güncellemek için PUT isteği
app.put('/api/updateQuestion/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const { survey_id, question_text, question_type } = req.body;
    const queryText = 'UPDATE questions SET survey_id = $1, question_text = $2, question_type = $3, last_updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *';
    const values = [survey_id, question_text, question_type, questionId];
    const result = await pool.query(queryText, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
     //console.error('Error executing query', error);
    res.status(500).send('Error updating question');
  }
});


// Yeni bir soru seçeneği oluşturmak için POST isteği
app.post('/api/createQuestionOption', async (req, res) => {
  try {
    const { question_id, option_text, option_letter, is_correct } = req.body;
    const queryText = 'INSERT INTO question_options (question_id, option_text, option_letter, is_correct) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [question_id, option_text, option_letter, is_correct];
    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
     //console.error('Error executing query', error);
    res.status(500).send('Error creating question option');
  }
});

// Soru seçeneğini güncellemek için PUT isteği
app.put('/api/updateQuestionOption/:id', async (req, res) => {
  try {
    const optionId = req.params.id;
    const { question_id, option_text, option_letter, is_correct } = req.body;
    const queryText = 'UPDATE question_options SET question_id = $1, option_text = $2, option_letter = $3, is_correct = $4, last_updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *';
    const values = [question_id, option_text, option_letter, is_correct, optionId];
    const result = await pool.query(queryText, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
     //console.error('Error executing query', error);
    res.status(500).send('Error updating question option');
  }
});


// Anketi silme endpoint'i
app.delete('/api/deleteSurvey/:id', async (req, res) => {
  const surveyId = req.params.id;

  try {
    // PostgreSQL'de sorgu çalıştırma
    const result = await pool.query('DELETE FROM surveys WHERE id = $1', [surveyId]);

    if (result.rowCount === 1) {
      res.status(200).send('Anket başarıyla silindi.');
    } else {
      res.status(404).send('Belirtilen ID ile anket bulunamadı.');
    }
  } catch (error) {
     //console.error('Anket silinirken bir hata oluştu:', error);
    res.status(500).send('Anket silinirken bir hata oluştu.');
  }
});


// Soruyu silme endpoint'i
app.delete('/api/deleteQuestion/:id', async (req, res) => {
  const questionId = req.params.id;

  try {
    // PostgreSQL'de sorgu çalıştırma
    const result = await pool.query('DELETE FROM questions WHERE id = $1', [questionId]);

    if (result.rowCount === 1) {
      res.status(200).send('Soru başarıyla silindi.');
    } else {
      res.status(404).send('Belirtilen ID ile soru bulunamadı.');
    }
  } catch (error) {
     //console.error('Soru silinirken bir hata oluştu:', error);
    res.status(500).send('Soru silinirken bir hata oluştu.');
  }
});



// Seçeneği silme endpoint'i
app.delete('/api/deleteQuestionOption/:id', async (req, res) => {
  const optionId = req.params.id;

  try {
    // PostgreSQL'de sorgu çalıştırma
    const result = await pool.query('DELETE FROM question_options WHERE id = $1', [optionId]);

    if (result.rowCount === 1) {
      res.status(200).send('Seçenek başarıyla silindi.');
    } else {
      res.status(404).send('Belirtilen ID ile seçenek bulunamadı.');
    }
  } catch (error) {
     //console.error('Seçenek silinirken bir hata oluştu:', error);
    res.status(500).send('Seçenek silinirken bir hata oluştu.');
  }
});


// POST /api/saveUserSurveyAnswers endpoint'i

app.post('/api/saveUserSurveyAnswers', async (req, res) => {
  try {
    const { user_id, survey_id, question_id, question_option_id } = req.body;

    // Veritabanına kullanıcı anket cevaplarını eklemek için SQL sorgusu
    const queryText = 'INSERT INTO user_survey_answers (user_id, survey_id, question_id, question_option_id) VALUES ($1, $2, $3, $4)'

    const values = [user_id, survey_id, question_id, question_option_id];

    // Veritabanına sorguyu gönder
    const result = await pool.query(queryText, values);

    res.status(201).json(result.rows[0]); // Yeni eklenen kaydı yanıt olarak döndür
  } catch (err) {
     //console.error('Error saving user survey answers:', err);
    res.status(500).json({ error: 'An error occurred while saving user survey answers' });
  }
});

app.get('/api/getUserSurveyAnswer/:userId/:surveyId/:questionId', async (req, res) => {
  try {
    const { userId, surveyId, questionId } = req.params;

    // Kullanıcının belirli bir ankette belirli bir soruya verdiği cevabı getir
    const queryText = 'SELECT * FROM user_survey_answers WHERE user_id = $1 AND survey_id = $2 AND question_id = $3';
    const values = [userId, surveyId, questionId];
    const result = await pool.query(queryText, values);

    if (result.rows.length > 0) {
      // Eğer cevap varsa cevabı döndür
      res.status(200).json(result.rows[0]);
    } else {
      // Eğer cevap yoksa null döndür
      res.status(200).json(null);
    }
  } catch (err) {
     //console.error('Error getting user survey answer:', err);
    res.status(500).json({ error: 'An error occurred while getting user survey answer' });
  }
});

// Define the API endpoint
app.get('/api/getUserSurveyAnswersBefore', async (req, res) => {
  const { user_id, survey_id } = req.query;

  if (!user_id || !survey_id) {
      return res.status(400).json({ error: 'user_id and survey_id are required' });
  }

  try {
      const result = await pool.query(
          'SELECT * FROM user_survey_answers WHERE user_id = $1 AND survey_id = $2',
          [user_id, survey_id]
      );

      res.json(result.rows);
  } catch (error) {
       //console.error('Error fetching user survey answers:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateUserSurveyAnswer', async (req, res) => {
  try {
    const { answerId, questionOptionId } = req.body;

    // Kullanıcının anket cevabını güncellemek için SQL sorgusu
    const queryText = 'UPDATE user_survey_answers SET question_option_id = $1 WHERE id = $2';
    const values = [questionOptionId, answerId];
    await pool.query(queryText, values);

    res.status(200).json({ message: 'User survey answer updated successfully' });
  } catch (err) {
     //console.error('Error updating user survey answer:', err);
    res.status(500).json({ error: 'An error occurred while updating user survey answer' });
  }
});



// POST /api/saveUserSurveyAnswers endpoint'i

app.post('/api/saveUserSurveyOpenAnswers', async (req, res) => {
  try {
    const { user_id, survey_id, question_id, answer } = req.body;

    const checkQuery = 'SELECT * FROM user_open_answers WHERE user_id = $1 AND survey_id = $2 AND question_id = $3';
    const checkValues = [user_id, survey_id, question_id];
    const checkResult = await pool.query(checkQuery, checkValues);

    let queryText, values;

    if (checkResult.rows.length > 0) {
      // Update existing record
      queryText = 'UPDATE user_open_answers SET answer = $4, answered_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND survey_id = $2 AND question_id = $3';
      values = [user_id, survey_id, question_id, answer];
    } else {
      // Insert new record
      queryText = 'INSERT INTO user_open_answers (user_id, survey_id, question_id, answer) VALUES ($1, $2, $3, $4)';
      values = [user_id, survey_id, question_id, answer];
    }

    await pool.query(queryText, values);
    res.status(200).json({ message: 'Operation successful' });
  } catch (err) {
     //console.error('Error saving user survey answers:', err);
    res.status(500).json({ error: 'An error occurred while saving user survey answers' });
  }
});

app.get('/api/getUserSurveyOpenAnswers', async (req, res) => {
  try {
    const { user_id, survey_id } = req.query;

    const queryText = 'SELECT question_id, answer FROM user_open_answers WHERE user_id = $1 AND survey_id = $2';
    const values = [user_id, survey_id];

    const result = await pool.query(queryText, values);

    res.status(200).json(result.rows); // Cevapları yanıt olarak döndür
  } catch (err) {
     //console.error('Error retrieving user survey answers:', err);
    res.status(500).json({ error: 'An error occurred while retrieving user survey answers' });
  }
});



// Yeni bir kullanıcı aktivite kaydı eklemek için POST endpointi
app.post('/api/user_activity_logs', async (req, res) => {
  const { user_id, action, stage, video_1_watched, video_2_watched } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO user_activity_logs (user_id, action, stage, video_1_watched, video_2_watched) VALUES ($1, $2, $3, $4, $5) RETURNING *' ,
      [
        user_id, 
        action, 
        stage, 
        video_1_watched !== undefined ? video_1_watched : null, 
        video_2_watched !== undefined ? video_2_watched : null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/user_asama_degisiklik', async (req, res) => {
  const { user_id, stage, video_1_watched, video_2_watched } = req.body;

  try {
    // Önce mevcut bir kayıt olup olmadığını kontrol et
    const existingRecord = await pool.query(
      'SELECT * FROM user_activity_logs WHERE user_id = $1 AND action = $2',
      [user_id, 'Phase Change']
    );

    if (existingRecord.rows.length > 0) {
      // Kayıt varsa güncelle
      const updateResult = await pool.query(
        'UPDATE user_activity_logs SET stage = $1, video_1_watched = $2, video_2_watched = $3, created_at = CURRENT_TIMESTAMP WHERE user_id = $4 AND action = $5 RETURNING *',
        [
          stage,
          video_1_watched !== undefined ? video_1_watched : null,
          video_2_watched !== undefined ? video_2_watched : null,
          user_id,
          'Phase Change'
        ]
      );
      res.status(200).json(updateResult.rows[0]);
    } else {
      // Kayıt yoksa yeni bir kayıt ekle
      const insertResult = await pool.query(
        'INSERT INTO user_activity_logs (user_id, action, stage, video_1_watched, video_2_watched) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          user_id,
          'Phase Change',
          stage,
          video_1_watched !== undefined ? video_1_watched : null,
          video_2_watched !== undefined ? video_2_watched : null
        ]
      );
      res.status(201).json(insertResult.rows[0]);
    }
  } catch (err) {
     //console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user_stage/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    const result = await pool.query(
      'SELECT * FROM user_activity_logs WHERE user_id = $1 AND action = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'Phase Change']
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'No stage found for this user with action "Phase Change"' });
    }
  } catch (err) {
     //console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tüm kullanıcı aktivite loglarını çekme endpoint'i
app.get('/api/user-activity-logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_activity_logs');
    res.json(result.rows);
  } catch (error) {
     //console.error('Error fetching user activity logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Tüm anketleri silen endpoint
app.delete('/api/deleteAllSurveys', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM surveys');
    client.release();
    res.status(200).send('Tüm anketler başarıyla silindi.');
  } catch (err) {
     //console.error('Hata:', err);
    res.status(500).send('Bir hata oluştu, anketler silinemedi.');
  }
});

// Server tarafında deleteAllQuestions endpoint'i
app.delete('/api/deleteAllQuestions/:surveyId', async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const client = await pool.connect();
    await client.query('DELETE FROM questions WHERE survey_id = $1', [surveyId]);
    client.release();
    res.status(200).send('Anketin tüm soruları başarıyla silindi.');
  } catch (err) {
     //console.error('Hata:', err);
    res.status(500).send('Bir hata oluştu, sorular silinemedi.');
  }
});


// Server tarafında deleteAllQuestions endpoint'i
app.delete('/api/deleteAllQuestions/:surveyId', async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const client = await pool.connect();
    await client.query('DELETE FROM questions WHERE survey_id = $1', [surveyId]);
    client.release();
    res.status(200).send('Anketin tüm soruları başarıyla silindi.');
  } catch (err) {
    //console.error('Hata:', err);
    res.status(500).send('Bir hata oluştu, sorular silinemedi.');
  }
});

// Server tarafında deleteAllOptions endpoint'i
app.delete('/api/deleteAllOptions/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const client = await pool.connect();
    await client.query('DELETE FROM question_options WHERE question_id = $1', [questionId]);
    client.release();
    res.status(200).send('Sorunun tüm seçenekleri başarıyla silindi.');
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).send('Bir hata oluştu, seçenekler silinemedi.');
  }
});

// /api/watchVideo endpoint'i
app.post('/api/watchVideo', async (req, res) => {
  try {
    const { user_id, action } = req.body;

    let updateField;
    if (action === 'watch_video1') {
      updateField = 'video_1_watched';
    } else if (action === 'watch_video2') {
      updateField = 'video_2_watched';
    }

    // Veritabanında kullanıcı aktiviteyi kontrol et
    const result = await pool.query('SELECT * FROM user_activity_logs WHERE user_id = $1 AND action = $2', [user_id, 'watch_video']);

    if (result.rows.length > 0) {
      // Eğer kullanıcı aktivitesi bulunduysa, güncelleme yap
      await pool.query(`UPDATE user_activity_logs SET ${updateField} = true, created_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND action = $2`, [user_id, 'watch_video']);
      res.status(200).json({ message: 'Aktivite güncellendi' });
    } else {
      // Kullanıcı aktivitesi bulunamadı, yeni kayıt ekle
      await pool.query(`INSERT INTO user_activity_logs (user_id, action, created_at, ${updateField}) VALUES ($1, $2, CURRENT_TIMESTAMP, true)`, [user_id, 'watch_video']);
      res.status(201).json({ message: 'Yeni aktivite eklendi' });
    }
  } catch (error) {
    console.error('Hata:', error.message);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
});


// /api/getWatchStatus endpoint'i
// /api/getWatchStatus endpoint'i
app.get('/api/getWatchStatus', async (req, res) => {
  try {
    const { user_id, action } = req.query;

    let updateField;
    if (action === 'watch_video1') {
      updateField = 'video_1_watched';
    } else if (action === 'watch_video2') {
      updateField = 'video_2_watched';
    }

    const query = `
      SELECT ${updateField}
      FROM user_activity_logs
      WHERE user_id = $1 AND action = $2
    `;
    const values = [user_id,  'watch_video'];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('No matching record found');
    }

    // Log the result to console
    console.log("result.rows[0] >>>> ", result.rows[0]); // Assuming only one row is expected

    res.status(200).json(result.rows[0]); // Return the result to client
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
