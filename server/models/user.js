// C:\angular\anketweb-main\server\models\user.js

class User {
    constructor(userData) {
      this.first_name = userData.first_name;
      this.last_name = userData.last_name;
      this.phone_number = userData.phone_number;
      this.email = userData.email;
      this.password = userData.password;
      // Ek olarak, gerektiğinde diğer alanları da buraya ekleyebilirsiniz
    }
  }
  
  module.exports = User;
