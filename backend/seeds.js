require('dotenv').config(); 
const mongoose = require('mongoose');
const User = require('./models/User');  

mongoose.connect(MONGODB_URI)  
  .then(async () => {
 
    const teacher = await User.create({
      name: 'Ahmed',
      email: 'imteacher@test.com',
      password: 'password123',
      role: 'teacher'
    });

     const student = await User.create({
      name: 'ali',
      email: 'imstudent@test.com',
      password: 'password123',
      role: 'student'
    });

    console.log('Created Teacher ID:', teacher._id);
    console.log('Created Student ID:', student._id);
    process.exit();
  })
  .catch(err => console.error(err));