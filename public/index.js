var syllablesFirstLine = 0;
var syllablesSecondLine = 0;
var syllablesThirdLine = 0;

$('#instructionButton').on('click', function(event){
	$(this).parent().addClass('hidden');
})


function disableFields() {
$('#secondLine').prop('disabled', true);
$('#thirdLine').prop('disabled', true); 
$('#post').prop('disabled',true);
}


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
}

function doAjaxSecondStuff() {
	syllablesSecondLine = 0;
	let secondLine = $('#secondLine').val().split(' ');
	for (i=0; i<secondLine.length; i++) {
		getSecondLineSyllables(secondLine[i]);
	}
}

function doAjaxThirdStuff() {
	syllablesThirdLine = 0;
	let thirdLine = $('#thirdLine').val().split(' ');
	for (i=0; i<thirdLine.length; i++) {
		getThirdLineSyllables(thirdLine[i]);
	}
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
		if (syllablesFirstLine == 5) {
			checkFirstLine(syllablesFirstLine);
		}
	})
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
		if (syllablesSecondLine == 7) {
			checkSecondLine(syllablesSecondLine);
		}
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
		if (syllablesThirdLine == 5) {
			checkThirdLine(syllablesThirdLine);
		}
	});
}

function checkFirstLine() {
	if (syllablesFirstLine == 5) {
		alert('syllables achieved. compose second line');
		$('#secondLine').prop('disabled',false);
	}
}

function checkSecondLine(line) {
	if (line == 7) {
		alert('syllables achieved, compose third line');
		$('#thirdLine').prop('disabled', false);
	}
}

function checkThirdLine(line) {
	if (line == 5) {
		alert('syllables achieved. you win');
		$('#post').prop('disabled', false).removeClass('inactive');
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
	$('#log').html('');
		for (i=0;i<data.length;i++) {
			$('#log').append(`
				<div class='wholeShebang'>
					<p class='postedTitle'><span class='postedTitleData'>${data[i].title}</span></p>
					<p class='postedAuthor'>by: <span class='postedAuthorData'>${data[i].author}</span></p>
					<div class='postedHaiku'>
						<p class='postedHaikuLineOne'>${data[i].lines.lineOne}</p>
						<p class='postedHaikuLineTwo'>${data[i].lines.lineTwo}</p>
						<p class='postedHaikuLineThree'>${data[i].lines.lineThree}</p>
					</div>
					<p class='voteCount'>score: <span class='votes'></span></p>
					<div class='wholeShebangButtons'>
						<button class='delete hidden' data-id='${data[i].id}'>trash this haiku</button>
						<button class='vote' data-votes=0>give hai-5</button>
						<button class='edit hidden' data-id='${data[i].id}'>edit</button>
					</div>
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
	$(this).parent('.wholeShebangButtons').parent('.wholeShebang').find('.votes').html(votes);
})

$('#compositionForm').submit(function(event) {
	event.preventDefault();
	if (!$('#title').val()) {
		alert('add a title!');
	}
	else if (!$('#author').val()) {
		alert('add an author!');
	}
	else if(syllablesFirstLine !== 5) {
		alert('recompose first line to have 5 syllables!');
	}
	else if(syllablesSecondLine !== 7) {
		alert('recompose second line to have 7 syllables!');
	}
	else if(syllablesThirdLine !==5) {
		alert('recompose third line to have 5 syllables!');
	}
	else {
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
		$('#compositionForm').each(function(){
			this.reset();
		})
		disableFields();
	}
});

$(disableFields());

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
	let title = $(this).parent().parent().find('.postedTitleData').text();
	let author = $(this).parent().parent().find('.postedAuthorData').text();
	let firstLine = $(this).parent().parent().find('.postedHaikuLineOne').text();
	let secondLine = $(this).parent().parent().find('.postedHaikuLineTwo').text();
	let thirdLine = $(this).parent().parent().find('.postedHaikuLineThree').text();
	$(this).closest('.wholeShebang').html(`
		<input class='editTitle' value='${title}'>
		<input class='editAuthor' value='${author}'>
		<input class='editLineOne' value='${firstLine}'>
		<input class='editLineTwo' value='${secondLine}'>
		<input class='editLineThree' value='${thirdLine}'>
		<button type='put' class='put' data-id='${id}'>update this haiku</button>
		`);
})

$('#log').on('click', '.put', function(event){
	event.preventDefault();
	let id = $(this).data('id');
	console.log(id);
	let title = $(this).parent().parent().find('.editTitle').val();
	let author = $(this).parent().parent().find('.editAuthor').val();
	let firstLine = $(this).parent().find('.editLineOne').val();
	let secondLine = $(this).parent().find('.editLineTwo').val();
	let thirdLine = $(this).parent().find('.editLineThree').val();
	let datas = {
		"id": id,
		"title": title,
		"author": author,
		"lines": {
			"lineOne": firstLine,
			"lineTwo": secondLine,
			"lineThree": thirdLine
		}
	};
	$.ajax({
		type: 'put', 
		url: '/haikus/' + id,
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
    data : JSON.stringify(datas)
	});
	getHaikus();
});
