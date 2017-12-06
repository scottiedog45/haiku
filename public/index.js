//make the api call for each word in the haiku,
//return the syllable count and to make sure it's a word BOOLEAN

//can this be called everytime the user enters a space? 
//parse the line into words, indicees of an array
//push the results of the api call into a new array let syllableCountLineOne[], lineTwo[], lineThree[]
// they don't equal 5/7/5, log number, and ask user to repoem
//once completed, show a post poem button, 
//post poem to mongo db, edit and delete functionality
var syllablesFirstLine = 0;
var syllablesSecondLine = 0;
var syllablesThirdLine = 0;

$('#secondLine').prop('disabled', true);
$('#thirdLine').prop('disabled', true); 

function addTextAreaCallback(textArea, callback, delay) {
    var timer = null;
    textArea.onkeypress = function() {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout( function() {
            timer = null;
            callback();
        }, delay );
    };
    textArea = null;
}

addTextAreaCallback(document.getElementById("firstLine"), doAjaxFirstStuff, 4000);
addTextAreaCallback(document.getElementById("secondLine"), doAjaxSecondStuff, 4000);
addTextAreaCallback(document.getElementById("thirdLine"), doAjaxThirdStuff, 4000);


function doAjaxFirstStuff() {
	syllablesFirstLine = 0;
	let firstLine = $('#firstLine').val().split(' ');
	for (i=0; i<firstLine.length; i++) {
		getFirstLineSyllables(firstLine[i]);
	}
	checkFirstLine(syllablesFirstLine);
}

function doAjaxSecondStuff() {
	syllablesSecondLine = 0;
	let secondLine = $('#secondLine').val().split(' ');
	for (i=0; i<secondLine.length; i++) {
		getSecondLineSyllables(secondLine[i]);
	}
	checkSecondLine(syllablesSecondLine);
}

function doAjaxThirdStuff() {
	syllablesThirdLine = 0;
	let thirdLine = $('#thirdLine').val().split(' ');
	for (i=0; i<thirdLine.length; i++) {
		getThirdLineSyllables(thirdLine[i]);
	}
	checkThirdLine(syllablesThirdLine);
}

function getFirstLineSyllables(word) {
	$.ajax({
		url: 'https://wordsapiv1.p.mashape.com/words/' + word,
		type: 'GET',
		headers: {
			"X-Mashape-Key": "HI4GY8BYhlmshTogKuD5FS3oxrS9p11KjoFjsnhwssCC3QXH1v",
			"Accept": "application/json"
		}
	}).done(function(a){
		console.log(a);
		syllablesFirstLine += a.syllables.count;
	});
}

function getSecondLineSyllables(word) {
	$.ajax({
		url: 'https://wordsapiv1.p.mashape.com/words/' + word,
		type: 'GET',
		headers: {
			"X-Mashape-Key": "HI4GY8BYhlmshTogKuD5FS3oxrS9p11KjoFjsnhwssCC3QXH1v",
			"Accept": "application/json"
		}
	}).done(function(a){
		console.log(a);
		syllablesSecondLine += a.syllables.count;
	});
}

function getThirdLineSyllables(word) {
	$.ajax({
		url: 'https://wordsapiv1.p.mashape.com/words/' + word,
		type: 'GET',
		headers: {
			"X-Mashape-Key": "HI4GY8BYhlmshTogKuD5FS3oxrS9p11KjoFjsnhwssCC3QXH1v",
			"Accept": "application/json"
		}
	}).done(function(a){
		console.log(a);
		syllablesThirdLine += a.syllables.count;
	});
}

function checkFirstLine(line) {
	if (line = 5) {
		$('#secondLine').prop('disabled',false);
	}
}

function checkSecondLine(line) {
	if (line = 7) {
		$('#thirdLine').prop('disabled',false);
	}
}

function checkThirdLine(line) {
	if (line = 5) {
		alert('you win!');
	}
}


