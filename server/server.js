const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute =
  'mongodb+srv://admin:726839@cluster0-cje63.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

let hashCode = function(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

router.get('/', (req,res) => {
  return res.json({success:true, data: "Hello!"})
})

router.get('/room', (req, res) => {
  Data.find({id:req.query.roomId}, (err, data) => {
    if (err) return res.json({ success: false, error: "Room does not exist"});
    return res.json({success: true, data: data});
  });
});

router.post('/room', (req, res) => {
  let data = new Data();
  let roomTitle = req.query.title
  let newRoomId = hashCode(roomTitle);

  const param = { newRoomId, roomTitle };

  data.message = param.roomTitle;
  data.id = param.newRoomId;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));