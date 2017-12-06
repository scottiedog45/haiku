const mongoose = require('mongoose');

const haikuSchema = mongoose.Schema({
	title: {type: String},
	lines: {
		lineOne: {type: String},
		lineTwo: {type: String},
		lineThree: {type: String}
	},
	author: {type: String},
	created: {type: Date, default: Date.now}
});

haikuSchema.methods.apiRepr = function() {
	return {
		title: this.title,
		lines: this.lines,
		created: this.created,
		id: this.id
	};
}

const Haiku = mongoose.model('haikudatabase', haikuSchema, 'haikus');

module.exports = {Haiku};