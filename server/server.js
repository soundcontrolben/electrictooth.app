const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const config = require('./config');


const session = require('express-session');
const MongoStore = require('connect-mongo')(session);



const dbConnection = require('./services/database')
const passport = require('./services/passport');
const requireAuth = passport.requireAuth();

const albumRoutes = require('./routes/album');
const songRoutes = require('./routes/song');
const authRoutes = require('./routes/auth');
const resetRoutes = require('./routes/reset');
const paypalRoutes = require('./routes/paypal');
const userRoutes = require('./routes/user');
const ethRoutes = require('./routes/eth');
const downloadRoutes = require('./routes/download');

const app = express();

app.use(
  session({
    secret: '172f0e7dfc3a4cda8ac48c0ab4d62887',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: dbConnection.db,
      ttl: 2 * 24 * 60 * 60,
    }),
  }),
);

app.use(cors({exposedHeaders: '*'}));

function passHTML(req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'), function (
    err,
  ) {
    if (err) {
      res.status(500).send(err);
    }
  });
}

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use('/albums', albumRoutes);
app.use('/song', songRoutes);
app.use('/auth', authRoutes);
app.use('/reset', resetRoutes);
app.use('/paypal', paypalRoutes);
app.use('/user', requireAuth, userRoutes);
app.use('/eth', requireAuth, ethRoutes);
app.use('/download', requireAuth, downloadRoutes);

app.get('/*', passHTML);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(config.port);

console.log(`ET3-Server is listening on http://localhost:${config.port}`);


/*


require('../server/services/passport');
//protects routes by verifying user token



const streamRoutes = require('./routes/stream');
const orderRoutes = require('./routes/order');


app.use('/stream', requireAuth, streamRoutes);
app.use('/order', requireAuth, orderRoutes);










*/