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
		console.log(syllablesFirstLine);
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
		alert('syllables achieved. compose second line');
		$('#secondLine').prop('disabled',false);
	}
}

function checkSecondLine(line) {
	if (line = 7) {
		alert('syllables achieved, compose third line')
		$('#thirdLine').prop('disabled',false);
	}
}

function checkThirdLine(line) {
	if (line = 5) {
		alert('syllables achieved. you win');
		$('#compositionForm').append(`
			<button id='post' type='post'>send this haiku to the masses</button>`);
	}
}

$(document).ready(getHaikus());

function getHaikus() {
	$.ajax({
		type:'GET',
		datatype: 'json',
		url:'/haikus',
		success: function(data) {
			displayGottenHaikus(data);
		}
	});
}

function displayGottenHaikus(data) {
	console.log(data);
		for (i=0;i<data.length;i++) {
			$('#log').append(`
				<div class='wholeShebang'>
				<p class='postedTitle'>title: ${data[i].title}</p>
				<p class='postedAuthor'>author: ${data[i].author}</p>
				<p class='postedHaikuLineOne'>${data[i].lines.lineOne}</p>
				<p class='postedHaikuLineTwo'>${data[i].lines.lineTwo}</p>
				<p class='postedHaikuLineThree'${data[i].lines.lineThree}</p>
				<p class='votes'></p>
				<button class='delete' data-id='${data[i].id}'>trash this haiku</button>
				<button class='vote' data-votes=0>vote up</button>
				<button class='edit'>edit</button>
				</div>
				`);}
}

$('#log').on('click', '.vote', function(event) {
	event.preventDefault();
	let votes = $(this).data('votes');
	console.log(votes);
	votes += 1;
	console.log(votes);
	$(this).data('votes', votes);
	$(this).siblings('.votes').html(votes);
})

$('#compositionForm').on('click', '#post', function(event) {
	event.preventDefault();
	let title = $(this).parent().find('#title').val();
	let author = $(this).parent().find('#author').val();
	let lineOne = $(this).parent().find('#firstLine').val();
	let lineTwo = $(this).parent().find('#secondLine').val();
	let lineThree = $(this).parent().find('#thirdLine').val();
	let datas = {
		"title": title,
		"author": author,
		"lines": {
			"lineOne": lineOne,
			"lineTwo": lineTwo,
			"lineThree": lineThree
		}
	}
	$.ajax({
		url:'/haikus',
		type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(datas),
	});
	getHaikus();
});

$('#log').on('click', '.delete', function(event) {
	event.preventDefault();
	let id = $(this).data('id');
	$(this).closest('.wholeShebang').remove();
	$.ajax({
		method: 'delete',
		url: '/haikus/' + id,
	});
});

$('#log').on('click', '.edit', function(event){
	event.preventDefault();
	let id = $(this).data('id');
	let title = $(this).parent().find('.postedTitle').text();
	let author = $(this).parent().find('.postedAuthor').val();
	let firstLine = $(this).parent().find('.postedHaikuLineOne').val();
	let secondLine = $(this).parent().find('.postedHaikuLineTwo').val();
	let thirdLine = $(this).parent().find('.postedHaikuLineThree').val();
	$(this).closest('.wholeShebang').html(`
		<input class='title' value='${title}'>
		<button type='put'>update this haiku</button>
		`)

})

// $('#postHaiku').on('click', function() {
// 	$.ajax({
// 		method: 'POST',
// 		url: 
// 	});
// })



// $('#editHaiku').on('click', function {
// })
