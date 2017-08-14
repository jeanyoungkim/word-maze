var dayOfTest = getNthDayOfTest('08/09/2017');
var puzzleNumber = window.puzzleNumber

function checkLocalStorage() {
	console.log(localStorage);
	const savedDayOfTest = localStorage.getItem('dayOfTest')
	if (dayOfTest !== parseInt(savedDayOfTest)) {
		localStorage.setItem('dayOfTest', dayOfTest)
		// clearGameProgress()
		console.log(localStorage.getItem('dayOfTest'));
	}
	else return
}

function getPuzzleProgress(number) {
	return localStorage.getItem(`${number}-completed`);
}
