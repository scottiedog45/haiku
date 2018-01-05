var syllablesFirstLine = 0;
var syllablesSecondLine = 0;
var syllablesThirdLine = 0;

function disableFields() {
	$('#secondLine').prop('disabled', true);
	$('#thirdLine').prop('disabled', true);
	$('#secondLineCheck').prop('disabled', true).addClass('inactive');
	$('#thirdLineCheck').prop('disabled', true).addClass('inactive');
	$('#post').prop('disabled',true).addClass('inactive');
}

function doAjaxFirstStuff() {
	syllablesFirstLine = 0;
	let firstLine = (($('#firstLine').val()).replace(/[?<>.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")).replace(/\s{2,}/g," ").split(' ');
	for (i=0; i<firstLine.length; i++) {
		getFirstLineSyllables(firstLine[i]);
	}
	setTimeout(function(){
		checkFirstLine(syllablesFirstLine);
	}, 1250);
}

function doAjaxSecondStuff() {
	syllablesSecondLine = 0;
	let secondLine = (($('#secondLine').val()).replace(/[?<>.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")).replace(/\s{2,}/g," ").split(' ');
	for (i=0; i<secondLine.length; i++) {
		getSecondLineSyllables(secondLine[i]);
	}
	setTimeout(function(){
		checkSecondLine(syllablesSecondLine);
	}, 1250);
}

function doAjaxThirdStuff() {
	syllablesThirdLine = 0;
	let thirdLine = (($('#thirdLine').val()).replace(/[?<>.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")).replace(/\s{2,}/g," ").split(' ');
	for (i=0; i<thirdLine.length; i++) {
		getThirdLineSyllables(thirdLine[i]);
	}
	setTimeout(function(){
		checkThirdLine(syllablesThirdLine);
	}, 1250);
}

function getFirstLineSyllables(word) {
	$.ajax({
		url: `https://www.dictionaryapi.com/api/v1/references/collegiate/xml/${word}?key=83b96293-c901-45d0-bc7a-cdc7584dd17b`,
		type: 'GET'
	}).done(function(a){
		console.log(a);
		let b = a.getElementsByTagName("hw")[0].innerHTML.match(/[*]/g);
		if (b===null) {
			syllablesFirstLine += 1;
		} else {
		let c = (b.length + 1);
		syllablesFirstLine += c;
	}
});
}

function getSecondLineSyllables(word) {
	$.ajax({
		url: `https://www.dictionaryapi.com/api/v1/references/collegiate/xml/${word}?key=83b96293-c901-45d0-bc7a-cdc7584dd17b`,
		type: 'GET'
	}).done(function(a){
		let b = a.getElementsByTagName("hw")[0].innerHTML.match(/[*]/g);
		if (b===null) {
			syllablesSecondLine += 1;
		} else {
		let c = (b.length + 1);
		syllablesSecondLine += c;
	}
	});
}

function getThirdLineSyllables(word) {
	$.ajax({
		url: `https://www.dictionaryapi.com/api/v1/references/collegiate/xml/${word}?key=83b96293-c901-45d0-bc7a-cdc7584dd17b`,
		type: 'GET'
	}).done(function(a){
		let b = a.getElementsByTagName("hw")[0].innerHTML.match(/[*]/g);
		if (b===null) {
			syllablesThirdLine += 1;
		} else {
		let c = (b.length + 1);
		syllablesThirdLine += c;
	}
	});
}

function checkFirstLine(line) {
		if (line !== 5) {
			alert('syllables not achieved, rewrite!')
	} else {
		alert('syllables achieved. compose second line');
		$('#secondLine').prop('disabled',false);
		$('#secondLineCheck').removeClass('inactive').prop('disabled', false);
	}
}

function checkSecondLine(line) {
	if (line !== 7) {
		alert('incorrect number of syllables...');
	} else {
		alert('syllables achieved, compose third line');
		$('#thirdLine').prop('disabled', false);
		$('#thirdLineCheck').removeClass('inactive').prop('disabled', false);
	}
}

function checkThirdLine(line) {
	if (line !== 5) {
		alert('incorrect number of syllables...');
	} else {
		alert('syllables achieved. you win');
		$('#post').prop('disabled', false).removeClass('inactive');
	}
}

$(document).ready(getHaikus());

$('#welcomeHowToButton').on('click', function(event){
	if (this.hash !== "") {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $('#instructions').offset().top
		}, 800);
	}
});

$('#welcomeComposeButton').on('click', function(event){
	if (this.hash !== "") {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $('#composition').offset().top
		}, 800);
	}
});

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
				<p class='backgroundReadKanji'>読</p>
					<div class='wholeShebangWrapper' id=${data[i].id}>
						<p class='postedTitleData'>${data[i].title}</p>
						<p class='postedAuthor'>by: <span class='postedAuthorData'>${data[i].author}</span></p>
						<div class='postedHaiku'>
							<p class='postedHaikuLineOne'>${data[i].lines.lineOne}</p>
							<p class='postedHaikuLineTwo'>${data[i].lines.lineTwo}</p>
							<p class='postedHaikuLineThree'>${data[i].lines.lineThree}</p>
						</div>
						<p class='voteCount'>score: <span class='votes'>${data[i].score}</span></p>
						<div class='wholeShebangButtons'>
							<button class='delete hidden' data-id='${data[i].id}'>trash this haiku</button>
							<button class='vote' data-votes=${data[i].score}>give hai-5</button>
							<button class='edit hidden' data-id='${data[i].id}'>edit</button>
						</div>
					</div>
				</div>
				`);}
}

$('#log').on('click', '.vote', function(event) {
	event.preventDefault();
	let votes = $(this).data('votes');
	votes += 1;
	let id = $(this).siblings('.edit').data('id');
	console.log(id);
	let data = {
		"id": id,
		"score": votes
	}
	$.ajax({
		type: 'put',
		url: '/haikus/' + id,
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
    data : JSON.stringify(data)
	})
	$(this).data('votes', votes);
	$(this).parent('.wholeShebangButtons').parent('.wholeShebangWrapper').find('.votes').html(votes);
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
			},
			"score": 0
		}
		$.ajax({
			url:'/haikus',
			type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(datas)
		});
		$('#compositionForm').each(function(){
			this.reset();
		});
		disableFields();
		getHaikus();
		$('html,body').animate({scrollTop: $(document).height()}, 800);
	}
});

$(disableFields());

$('#firstLineCheck').on('click', function(event) {
	event.preventDefault();
	doAjaxFirstStuff();
});

$('#secondLineCheck').on('click', function(event) {
	event.preventDefault();
	doAjaxSecondStuff();
});

$('#thirdLineCheck').on('click', function(event) {
	event.preventDefault();
	doAjaxThirdStuff();
})

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
