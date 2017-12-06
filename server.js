const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const {DATABASE_URL, PORT} = require('./config');
const {Haiku} = require ('./models');
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

app.get('/haikus', (req, res) => {
	Haiku
		.find()
		.then(haikus => {
			res.json(haikus.map(
				(haiku) => haiku.apiRepr())
			);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: 'something went wrong'});
		});
});

app.post('/haikus', (req, res) => {
	const requiredFields = ['title', 'lines', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredfields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Haiku
		.create({
			title: req.body.title,
			lines: {
				lineOne: req.body.content.lineOne,
				lineTwo: req.body.content.lineTwo,
				lineThree: req.body.content.lineThree
			},
			author: req.body.author
		})
		.then(
			haiku=> res.status(201).json(haiku.apiRepr()))
		.catch(err=>{
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
});

app.put('notes/:id', (req, res)=> {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['title', 'content'];
	updateableFields.forEach(field=> {
		if (field in req.body) {
			updated[field]=req.body[field];
		}
	});

	Haiku
		.findByIdAndUpdate(req.params.id, {$set: updated}, {new:true})
		.then(updatedHaiku => res.status(204).end())
		.catch(err=> res.status(500).json({message: 'something went wrong'}));
});

app.delete('/haikus/:id', (req, res) => {
	Haiku
		.findByIdAndRemove(req.params.id)
		.then(()=>{
			console.log(`Deleted note with id \`${req.params.id}\``);
			res.status(204).end();
		});
});

app.use('*', function (req, res) {
	res.status(404).json({message: 'Not found, try again'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};