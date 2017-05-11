const feathers = require('feathers');
const bodyParser = require('body-parser');
const rest = require('feathers-rest');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');

'use strict';



const serviceHooks = {
	before: {
		all: [hook => {
      console.log(hook.params.query);
			if (typeof hook.params.query.read !== 'undefined') {
				hook.params.query.read = (hook.params.query.read === 'true') ? true : false;
			}
      console.log(hook.params.query);
      return hook;
		}],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};



// Create a feathers instance.
const app = feathers()
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks());

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

const messageService = app.service('messages');
messageService.hooks(serviceHooks);
// Create a dummy Message
messageService.create({
  text: 'Server message',
  read: false
}).then(function(message) {
  console.log('Created message', message);
});

app.listen(process.env.PORT, function() {
  console.log(`Feathers server listening on port ${process.env.PORT}`);
});