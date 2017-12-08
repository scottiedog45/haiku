const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const should = chai.should();
const {Haiku} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');

var server = require('../server.js')
var storage = server.storage;

chai.use(chaiHttp);

function seedHaikuData() {
	console.info('seeding haiku');
	const seedData = [];
	for (let i=1; i <=10; i++) {
		seedData.push(generateHaikuData());
	}
	return Haiku.insertMany(seedData);
}

function generateTitle() {
	const titles =[
	'A', 'B', 'C'];
	return titles[Math.floor(Math.random() * titles.length)];
}

function generateAuthor() {
	const authors=[
	'a', 'b', 'c'];
	return authors[Math.floor(Math.random() * authors.length)];
}

function generateLineOne () {
	const lineOnes = [
	'a', 'b', 'c'];
	return lineOnes[Math.floor(Math.random() * lineOnes.length)];
};

function generateLineTwo() {
	const lineTwos = [
	'a', 'b', 'c'];
	return lineTwos[Math.floor(Math.random() * lineTwos.length)];
}

function generateLineThree() {
	const lineThrees = [
	'a', 'b', 'c'];
	return lineThrees[Math.floor(Math.random() * lineThrees.length)];
}

function generateLines() {
	const lines = {
		lineOne: generateLineOne(),
		lineTwo: generateLineTwo(),
		lineThree: generateLineThree()
	};
	return lines;
}

function generateHaikuData() {
	return {
		title: generateTitle(),
		lines: generateLines(),
		author: generateAuthor()
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('haiku API resource', function() {
	before(function() {
		return runServer(DATABASE_URL);
	});

	beforeEach(function(){
		return seedHaikuData();
	});

	afterEach(function(){
		return tearDownDb();
	});

	after(function(){
		return closeServer();
	})

	describe('GET endpoint', function () {
		it('should return all existing haikus', function() {
			let res;
			return chai.request(app)
			.get('./haikus')
			.then(function(_res) {
				res=_res;
				res.should.have.status(200);
				res.body.haikus.should.have.length.of.at.least(1);
				return Haiku.count();
			})
			.then(function(count){
				res.body.haikus.should.have.length.of(count);
			})
			.catch(err=>{
				console.error(err);
			});
		});

		it('should return haikus with correct fields', function(){
			let resHaiku;
			return chai.request(app)
				.get('/haikus')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.length.of.at.least(1);
					res.body.forEach(function(haiku) {
						haiku.should.be.a('object');
						haiku.should.include.keys(
							'title', 'lines', 'author');
					});
					resHaiku = res.body[0];
					console.log(resHaiku);
					return Haiku.findById(resHaiku.id);
				})
				.then(function(haiku){
					resHaiku.title.should.equal(haiku.title);
					resHaiku.lines.lineOne.should.equal(haiku.lines.lineOne);
					resHaiku.lines.lineTwo.should.equal(haiku.lines.lineTwo);
					resHaiku.lines.lineThree.should.equal(haiku.lines.lineThree);
					resHaiku.author.should.equal(haiku.author);
				});
		});
	});

	describe('POST endpoint', function() {
		it('succesfully updated database with new post', function() {
			const newHaiku = generateHaikuData();
			return chai.request(app)
				.post('/haikus')
				.send(newHaiku)
				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'title', 'author', 'lines', 'id');
					res.body.title.should.equal(newHaiku.title);
					res.body.id.should.not.be.null;
					res.body.lines.should.include(newHaiku.lines);
					res.body.author.should.equal(newHaiku.author);
					return Haiku.findById(res.body.id);
				})
				.then(function(haiku){
					haiku.title.should.equal(newHaiku.title);
					haiku.lines.should.include(newHaiku.lines);
				});
		});
	});

	describe('PUT endpoint', function() {
		it('should update specified fields', function(){
			const updateData = {
				title: 'newTitle',
				id: '',
				author: 'newAuthor',
				lines: {
					lineOne: 'lineOne',
					lineTwo: 'lineTwo',
					lineThree: 'lineThree'
				}
			};
			return Haiku
				.findOne()
				.then(function(haiku){
					updateData.id=haiku.id;
					return chai.request(app)
						.put(`/haikus/${haiku.id}`)
						.send(updateData);
				})
				.then(function(res){
					res.should.have.status(204);
					return Haiku.findById(updateData.id);
				})
				.then(function(haiku){
					console.log('🌈')
					console.log(haiku.title);
					console.log(updateData.title);
					haiku.title.should.equal(updateData.title);
					haiku.author.should.equal(updateData.author);
					haiku.lines.lineOne.should.equal(updateData.lines.lineOne);
					haiku.lines.lineTwo.should.equal(updateData.lines.lineTwo);
					haiku.lines.lineThree.should.equal(updateData.lines.lineThree);
				});
		});
	});

	describe('DELETE endpoint', function() {
		it('should delete a blogpost by id', function()  {
			let haiku;
			return Haiku
			.findOne()
			.then(function(_haiku){
				haiku = _haiku;
				return chai.request(app).delete(`/haikus/${haiku.id}`);
			})
			.then(function(res){
				res.should.have.status(204);
				return Haiku.findById(haiku.id);
			})
			.then(function(_haiku){
				should.not.exist(_haiku);
			});
		});
	});
});



