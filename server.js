const feathers = require('feathers');
const bodyParser = require('body-parser');
const rest = require('feathers-rest');
const memory = require('feathers-memory');

// Create a feathers instance.
const app = feathers()
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Create an in-memory Feathers service with a default page size of 2 items
// and a maximum size of 4
app.use('/messages', memory({
  paginate: {
    default: 2,
    max: 4
  }
}));

// Create a dummy Message
app.service('messages').create({
  text: 'Server message',
  read: false
}).then(function(message) {
  console.log('Created message', message);
});

app.listen(process.env.PORT, function() {
  console.log(`Feathers server listening on port ${process.env.PORT}`);
});