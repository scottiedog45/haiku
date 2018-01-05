const mongoose = require('mongoose');

const haikuSchema = mongoose.Schema({
	title: {type: String},
	author: {type: String},
	lines: {
		lineOne: {type: String},
		lineTwo: {type: String},
		lineThree: {type: String}
	},
	score: {type: Number},
	created: {type: Date, default: Date.now}

});

haikuSchema.methods.apiRepr = function() {
	return {
		title: this.title,
		author: this.author,
		lines: this.lines,
		created: this.created,
		score: this.score,
		id: this.id
	};
}

const Haiku = mongoose.model('haikudatabase', haikuSchema, 'haikus');

module.exports = {Haiku};
