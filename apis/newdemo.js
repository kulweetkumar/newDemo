
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const usersRouter = require('./routes/userapiRoutes')(io);
const AdminRouter = require('./routes/users');
const cors = require('cors');

require('dotenv').config()
const PORT = process.env.PORT;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(fileUpload());
app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api', usersRouter);
app.use('/', AdminRouter);
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

require('./shocket/socket')(io)

// const schedule = require("node-schedule");

// const  job =  schedule.scheduleJob("*/2 * * * * *", async () => {

// })

http.listen(PORT, (req, res) => {
   console.log(`Server is running on ${PORT} port.`);
});
