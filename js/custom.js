$("#theword").fitText();
$("#playtime").fitText(1.35);
var seconds = 150;
var wiH = $(window).height();
var twH = $("#theword").height();
var twT = (wiH*0.5)-twH;
$("#worddiv").css('top',twT);
var words = [];
words[1] = 'Anjing &#128021;';
words[2] = 'Babi &#128055'; // 128023
//words[3] = 'Kampret';
words[3] = 'Tikus &#128000';
//words[4] = 'Wedhus &#128016 ';
words[4] = 'Kambing &#128016 ';
words[5] = 'Monyet &#128053';
var mn = 1;
var mx = 5;
window.localStorage.clear();
//localStorage.removeItem("runs");
initData(mn,mx);
randomRun(mn,mx);
function initData(min,max){	
	for(g=min;g<=max;g++){
		localStorage.setItem("words["+g+"]",words[g]);
		localStorage.setItem("ranks["+g+"]",0);
		localStorage.setItem("stats["+g+"]",0);
	}
	localStorage.setItem("startgame",0);
	localStorage.setItem("runs",min);
}
function getRanks(run){
	return localStorage.getItem("ranks["+run+"]")
}
function existRuns(min,cur,run){
	var exist = false;
	for(i=min;i<=cur;i++){
		er = localStorage.getItem('ranks['+i+']');
		if(er==run){
			exist = true;
		}
	}
	return exist;
}
function randomRun(min,max){
	var runs = [];
	var r = randomInt(min,max);
	for(j=min;j<=max;j++){
		do {
			r = randomInt(min,max);
		} while (existRuns(min,j,r)==true);
		runs[j] = r;
		localStorage.setItem('ranks['+j+']',runs[j]);
	}
	return runs;
}
function randomInt(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

var origin, updown;
function setOrigin(eve) {
	return origin = Math.floor(eve.alpha);
}
function setUpDown(eve) {
	updown = Math.floor(eve.alpha);
	deviceOrientationHandler(origin,updown,mn,mx);
	return updown;
}

if(window.DeviceOrientationEvent){
	window.addEventListener('deviceorientation', setOrigin, false);
	setTimeout(function() {
		window.removeEventListener('deviceorientation', setOrigin, false);
		window.addEventListener('deviceorientation', setUpDown, false);		
		window.addEventListener('deviceorientation', setOrigin, false);
    }, 3000);
} else {
	$('h1').text('Your browser sucks! Not Supported');
}
var cr = mn;
function deviceOrientationHandler(o,orientation,min,max){	
	if((orientation>=135)&&(o<135)){
		$('body').css('background','#197cd9');
		if(localStorage.getItem("startgame")==0){
			localStorage.setItem("startgame",1);
			$('.tobehide').hide();
			$("#playtime").countdown(getSecFromNow(seconds), function(event) {
			    $(this).html(event.strftime('%M:%S'));
			}).on('finish.countdown', function(event) {
				timeIsUp();
			});			
		} 
		updData(min,max);
		localStorage.setItem("stats["+cr+"]",1);
		//console.log(o+' '+orientation);
	}	
	if((orientation<=45)&&(o>45)){	
		if(localStorage.getItem("startgame")!=0){
			updData(min,max);
			$('body').css('background','#f57f2f');
		}
	}
}
function getSecFromNow(sec) {
	return new Date(new Date().valueOf() + sec * 1000);
}
function updData(min,max){
	var timeleft = $("#playtime").text();
	var completed = getCompleted(min,max);
	if(completed!=((max-min)+1)){
		if(timeleft!='00:00'){
			cr = parseInt(localStorage.getItem("runs")); //current runs
			if(cr<max){
				do {
					cr = cr + 1;
				} while ((localStorage.getItem("stats["+cr+"]")==1));
			} else {
				cr = min;
			}
			$('#theword').html(localStorage.getItem("words["+getRanks(cr)+"]"));
			localStorage.setItem("runs",cr);
		} else {
			timeIsUp();
		}
	} else {
		$("#playtime").countdown('stop');
		//$('#playtime').text(timeleft);
		$('h1.tobehide').text('Sisa waktu:').show();
		$('#theword').text('Selamat, semua kejawab!'); 
		$('body').css('background','#197cd9');
	}
}
function getCompleted(min,max){
	var tc = 0;	
	for(c=min;c<=max;c++){
		tc = tc + parseInt(localStorage.getItem('stats['+c+']'));
	}
	return tc;
}
function timeIsUp(){
	$('#theword').text('Waktu Habis!'); //time's up
	$('body').css('background','#f57f2f');
}
