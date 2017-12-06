const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
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

function generateLines() {
	const lines = [
	'A', 'B', 'C'];
	return lines[Math.floor(Math.random() * lines.length)];
}

function generateHaikuData() {
	return {
		title: generateTitle(),
		lines: generateLines()
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
		it('should return all existing notes', function {
			let rest;
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
			.cath(err=>{
				console.error(err);
			});
		});

		it('should return notes with correct fields', function(){
			let resHaiku;
			return chai.request(app)
				.get('/haikus')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.length.of.at.least(1);
					res.body.forEach(function(haiku) {
						haiku.should.be.a.('object');
						haiku.should.include.keys(
							'title', 'lines', 'created');
					});
					resHaiku = res.body[0];
					console.log(resHaiku);
					return Haiku.findById(resHaiku.id);
				})
				.then(function(haiku){
					resHaiku.title.should.equal(haiku.title);
					resHaiku.lines.should.equal(haiku.lines);
				});
		});
	});



