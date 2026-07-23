require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const { validateAuthConfig } = require('./config/auth');

validateAuthConfig();
connectDB();

const app = express();


app.use(cors());                  
app.use(express.json());          
app.use(morgan('dev'));           


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use('/api/auth', require('./routes/auth'));          
app.use('/api/subjects', require('./routes/subjects'));  
app.use('/api/materials', require('./routes/materials')); 


app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use('/api/v1', require('./routes/v1'));


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'المسار غير موجود' }));

// معالج الأخطاء المركزي — لازم يكون آخر middleware
app.use(require('./middleware/error.middleware'));


const httpServer = http.createServer(app);
const io = initSocket(httpServer);
app.set('io', io); // نخلي الـio متاح للكنترولرز عشان تبعت إشعارات لحظية

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}`));
