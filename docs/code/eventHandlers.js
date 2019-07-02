var pearClicks = 0;

function initEventHandlers() {
	//document.getElementById('pearimg').onclick = function() { changePearText() };
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