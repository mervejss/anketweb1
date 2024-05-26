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
  user: 'postgres',
  host: 'localhost',
  database: 'anketweb',
  password: '1234',
  port: 5432, // Varsayılan PostgreSQL portu
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
  console.log(req.body)
  const { first_name, last_name, phone_number, email, password } = user;
  pool.query('INSERT INTO users (first_name, last_name, phone_number, email, password) VALUES ($1, $2, $3, $4, $5)',
    [first_name, last_name, phone_number, email, password],
    (error, results) => {
      if (error) {
        console.error('Veritabanına kayıt eklenirken hata oluştu: ', error);
        return res.status(500).json({ status: 500, message: 'Veritabanına kayıt eklenirken hata oluştu' });
      }
      let payload = {subject: results.id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
      console.log('Normal Kullanici başarıyla kaydedildi');
      console.log(token);
      

      //return res.status(201).json({ status: 201, message: 'Kullanıcı başarıyla eklenmiştir', user });
    });
});


app.post('/api/login', (req, res) => {
  let userData = req.body

  // Veritabanında kullanıcının varlığını ve şifresini kontrol et
  pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
    if (error) {
      console.error('Veritabanı hatası: ', error);
      return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
    }

    if (user.rows.length > 0) {
      // Kullanıcı var, giriş başarılı
      console.log('Normal Kullanici Giriş başarılı, Hoş geldiniz' + user.rows[0].id, user.rows[0].phone_number);
      let payload = {subject: user.id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})

    } else {
      console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');

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
        console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
  
      if (user.rows.length > 0) {
        // Kullanıcı var, giriş başarılı
        console.log('Giriş başarılı, Hoş geldiniz' + user.rows[0].id, user.rows[0].phone_number);
        let payload = {subject: user.id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})

      } else {
        console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');
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
      console.error('Veritabanı hatası: ', error);
      return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
    }

    if (user.rows.length > 0) {
      // Kullanıcı var, giriş başarılı
      console.log('Bilgiler bulundu ve getirildi : ' + user.rows[0].id,user.rows[0].first_name,user.rows[0].last_name,user.rows[0].phone_number,user.rows[0].email,user.rows[0].password);
      const userInfo = user.rows[0];

          // Değişkeni response olarak gönder
          res.status(200).send(userInfo);

    } else {
      console.error(error);
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
  console.log(req.body)
  // Kullanıcının özelliklerine erişerek ilgili alanları al
  const { first_name, last_name, phone_number, email, password } = user;
  // Veritabanına admini kaydet
  pool.query('INSERT INTO admins (first_name, last_name, phone_number, email, password) VALUES ($1, $2, $3, $4, $5)',
    [first_name, last_name, phone_number, email, password],
    (error, results) => {
      if (error) {
        console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
      let payload = {subject: results.id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
      console.log('Admin başarıyla kaydedildi');
      console.log(token);
      //return res.status(200).json({ status: 200, message: 'Admin başarıyla kaydedildi' });
    });
  })


  app.post('/api/adminlogin',(req, res) => {
    let userData = req.body
  
    // Veritabanında kullanıcının varlığını ve şifresini kontrol et
    pool.query('SELECT * FROM admins WHERE email = $1 AND password = $2', [userData.email, userData.password], (error, user) => {
      if (error) {
        console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
  
      if (user.rows.length > 0) {
        // Kullanıcı var, giriş başarılı
        console.log('Giriş başarılı, Hoş geldiniz' + user.rows[0].id, user.rows[0].phone_number);
        let payload = {subject: user.id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})

      } else {
        console.error('Hatalı giriş bilgileri !! Bilgilerinizi kontrol ediniz !');
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
        console.error('Veritabanı hatası: ', error);
        return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }
  
      if (user.rows.length > 0) {
        // Kullanıcı var, giriş başarılı
        console.log('Bilgiler bulundu ve getirildi : ' + user.rows[0].id,user.rows[0].first_name,user.rows[0].last_name,user.rows[0].phone_number,user.rows[0].email,user.rows[0].password);
        const userInfo = user.rows[0];

            // Değişkeni response olarak gönder
            res.status(200).send(userInfo);

      } else {
        console.error(error);
        // Kullanıcı yok veya şifre yanlış
        return res.status(401).json({ status: 401, message: error });
      }
    });
  });


  app.post('/api/questions', (req, res) => {
    const tiklananAnketId = req.body.tiklananAnketId;

    pool.query('SELECT * FROM questions WHERE survey_id = $1', [tiklananAnketId], (error, queryResult) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
        }

        if (queryResult.rows.length > 0) {
            // Sorular bulundu, başarılı olarak döndür
            const questions = queryResult.rows;
            console.log('Bilgiler bulundu ve getirildi : ' + questions);
            res.status(200).json(questions);
        } else {
            console.error(error);
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
          console.error(error);
          return res.status(500).json({ status: 500, message: 'Bir hata oluştu' });
      }

      if (queryResult.rows.length > 0) {
          // Seçenekler bulundu, başarılı olarak döndür
          const options = queryResult.rows;
          console.log('OPTIONS : ' ,options);

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
    console.error('Error executing query', err);
    res.status(500).send('Error fetching users from database');
  }
});




// Anketleri getiren endpoint
app.get('/api/surveys', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM surveys');
    const surveys = result.rows;
    res.json(surveys);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
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
    console.error('Error executing query', error);
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
    console.error('Error executing query', error);
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
    console.error('Error executing query', error);
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
    console.error('Error executing query', error);
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
    console.error('Error executing query', error);
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
    console.error('Anket silinirken bir hata oluştu:', error);
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
    console.error('Soru silinirken bir hata oluştu:', error);
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
    console.error('Seçenek silinirken bir hata oluştu:', error);
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
    console.error('Error saving user survey answers:', err);
    res.status(500).json({ error: 'An error occurred while saving user survey answers' });
  }
});




// POST /api/saveUserSurveyAnswers endpoint'i

app.post('/api/saveUserSurveyOpenAnswers', async (req, res) => {
  try {
    const { user_id, survey_id, question_id, answer } = req.body;

    // Veritabanına kullanıcı anket cevaplarını eklemek için SQL sorgusu
    const queryText = 'INSERT INTO user_open_answers (user_id, survey_id, question_id, answer) VALUES ($1, $2, $3, $4)'

    const values = [user_id, survey_id, question_id, answer];

    // Veritabanına sorguyu gönder
    const result = await pool.query(queryText, values);

    res.status(201).json(result.rows[0]); // Yeni eklenen kaydı yanıt olarak döndür
  } catch (err) {
    console.error('Error saving user survey answers:', err);
    res.status(500).json({ error: 'An error occurred while saving user survey answers' });
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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Kullanıcı durumunu değiştirmek için POST endpointi
app.post('/api/user_asama_degisiklik', async (req, res) => {
  const { user_id, stage, video_1_watched, video_2_watched } = req.body;

  try {
    // Aynı user_id ile action 'Phase Change' olan bir kayıt var mı kontrol et
    const checkResult = await pool.query(
      'SELECT * FROM user_activity_logs WHERE user_id = $1 AND action = $2',
      [user_id, 'Phase Change']
    );

    if (checkResult.rows.length > 0) {
      // Kayıt varsa, sadece stage ve video_watched bilgilerini güncelle
      const updateResult = await pool.query(
        'UPDATE user_activity_logs SET stage = $1, video_1_watched = $2, video_2_watched = $3 WHERE user_id = $4 AND action = $5 RETURNING *',
        [
          stage,
          video_1_watched !== undefined ? video_1_watched : checkResult.rows[0].video_1_watched,
          video_2_watched !== undefined ? video_2_watched : checkResult.rows[0].video_2_watched,
          user_id,
          'Phase Change'
        ]
      );
      res.status(200).json(updateResult.rows[0]);
    } else {
      // Kayıt yoksa, yeni kayıt ekle
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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get('/api/user_stage/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    const result = await pool.query(
      'SELECT stage FROM user_activity_logs WHERE user_id = $1 AND action = $2',
      [userId, 'Phase Change']
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'No stage found for this user with action "Phase Change"' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////



