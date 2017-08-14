var data;
var puzzleSelectButtons = document.querySelectorAll('.puzzle-select');

function initialize() {
	checkLocalStorage();
	applyProgressToButtons();
}

function applyProgressToButtons() {
	puzzleSelectButtons.forEach(function(button, index) {
		var puzzleNumber = index + 1;
		if (getPuzzleProgress(puzzleNumber)) button.classList += " completed";
	})
}

function getPuzzleData() {
	data = puzzles[dayOfTest][puzzleNumber];
	letters = data.letters.split('');
}

initialize();
