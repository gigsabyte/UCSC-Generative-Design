/*
 * eventHandlers.js
 * holds initEventHandlers() which sets event functions
 * as well as actual event functions
 * not used in asg1
 * written by gigsabyte
 */

var pearClicks = 0;

function initEventHandlers() {
	//document.getElementById('pearimg').onclick = function() { changePearText() };
	document.getElementById('showgif').onclick = function() { toggleGif() };
}

function changePearText() {
	let pearText = document.getElementById('peartxt');
	if(pearClicks == 0) {
		pearText.innerHTML = "Please don't poke him :(";
	}
	else if (pearClicks == 1) {
		pearText.innerHTML = "Why did you poke him again!!!!";
	}
	else if(pearClicks == 2) {
		pearText.innerHTML = "You're hurting him!!!!!!!";
	}
	else if(pearClicks < 5) {
		pearText.innerHTML = "You're a monster.";
	}
	else {
		document.getElementById('pearimg').style.display = 'none';
		pearText.innerHTML = "You've clicked him too much. He's gone forever now.";
	}
	++pearClicks;
	let percent = pearClicks*20;
	document.getElementById('pearimg').style.filter = "invert(" + percent + "%)";
}

function toggleGif() {

	let gif = document.getElementById('asg1gif');
	let text = document.getElementById('showgif');

	if(text.innerHTML == "Show .gif representation") {
		text.innerHTML = "Hide .gif representation";
		gif.style.display = "inline";
	} else {
		text.innerHTML = "Show .gif representation";
		gif.style.display = "none";
	}

}