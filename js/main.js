var data;
var letters;
var selectedCell;
var selectedCells = [];

var isMobile = mobileCheck();
var eventType = isMobile ? 'touchstart' : 'mouseover';

function initialize() {
	// localStorage.clear();
	checkLocalStorage();
	getPuzzleData();

	var completedPuzzle = getPuzzleProgress(puzzleNumber);
	if (completedPuzzle) {
		renderBoard(completedPuzzle);
	} else {
		renderBoard();
	}

	renderPuzzleInfo();
	setUpEventHandlers();
}

function renderPuzzleInfo() {
	var date = document.querySelector('.puzzle-date');
	date.innerText = moment().format('MMMM D, YYYY');

	var theme = document.querySelector('.theme').querySelector('h1');
	theme.innerText = data.theme;
}

function getPuzzleData() {
	var puzzleIndex = puzzleNumber - 1
	var todaysPuzzles = puzzles[dayOfTest] ? puzzles[dayOfTest] : puzzles[0]; // default to the first day if the test is over
	data = todaysPuzzles[puzzleIndex];
	letters = data.letters.split('');
}

function renderBoard(progress) {
	var board = document.querySelector('.board');

	var numRows = data.height;
	var numColumns = data.width;
	var cellWidth = isMobile ? (window.innerWidth - 20)/(numColumns + 1) : 800 / (numColumns + 1);

	var mobileBoardWidth = window.innerWidth - 20;
	var desktopBoardWidth = numColumns * (cellWidth + 10);
	var boardWidth = isMobile && numColumns > 4 ? mobileBoardWidth : desktopBoardWidth;

	if (progress) {
		board.outerHTML = progress;
		board.style.width = `${boardWidth}px`;
		document.querySelectorAll('.cell').forEach(function(cell) {
			cell.style.width = 800 / (numColumns + 1);
		})
	} else {
		board.style.width = `${boardWidth}px`;
		for ( i = 0; i < numRows; i++ ) {
			var colNum = 1;
			for ( j = numColumns * i; j < (numColumns * (i + 1)); j++ ) {
					var cell = document.createElement('div');
					var verticalPath = document.createElement('div');
					verticalPath.className = "verticalPath";
					var horizontalPath = document.createElement('div');
					horizontalPath.className = "horizontalPath";
					cell.className = "cell";
					cell.style.width = cellWidth + "px";
					cell.style.height = cellWidth + "px";
					if (data.circled.indexOf(j) > -1) cell.className += " circled";
					if (data.black && data.black.indexOf(j) > -1) {
						cell.className = 'black';
						board.appendChild(cell);
					} else {
						cell.innerHTML = data.letters[j];
						cell.setAttribute("row", i + 1);
						cell.setAttribute("column", colNum);
						cell.appendChild(verticalPath);
						cell.appendChild(horizontalPath);
					}

					if (colNum == numColumns) {
						colNum = 1;
					} else {
						colNum = colNum + 1;
					}

					board.appendChild(cell);

			}
		}
	}
}

function setUpEventHandlers() {
	var cellsNodeList = document.querySelectorAll('.cell');
	var cells = Array.prototype.slice.call(cellsNodeList, 0);
	document.addEventListener('click', function(e) {
		if (e.target.tagName == 'BODY') {
			clearAllSelected();
		}
	})

	var helpButton = document.querySelector('#help-button');
	helpButton.addEventListener('click', function() { openModal('help') });

	if (isMobile) {
		setUpMobileEventHandlers();
	} else {
		// bind events to individual cells to avoid swipe issues
		cells.forEach(function(cell){
			var isSelectable = !cell.classList.contains('black');

			cell.addEventListener(eventType, function(e) {
				e.stopPropagation();
				if (isSelectable && e.target.className.indexOf('cell') > -1) {
					registerClick(e.target);
				} else {
					clearAllSelected();
				}
			})
		})
	}
}

var mostRecentlyTouchedCell;

function setUpMobileEventHandlers() {
	var cells = document.querySelectorAll('.cell');

	cells.forEach(function(cell) {
		var isSelectable = !cell.classList.contains('black');
		cell.addEventListener('touchstart', handleTouchStart);
		cell.addEventListener('touchmove', handleTouchMove);
		cell.addEventListener('touchend', handleTouchEnd);
	})
}

function handleTouchStart(e) {
	e.preventDefault();
	registerClick(e.target);
	mostRecentlyTouchedCell = e.target;
}

function handleTouchMove(e) {
	e.preventDefault();
	var currentlyTouchedCell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
	if (currentlyTouchedCell != mostRecentlyTouchedCell) registerClick(currentlyTouchedCell);
	mostRecentlyTouchedCell = currentlyTouchedCell;
}

function handleTouchEnd(e) {
	e.preventDefault();
}

function getPathDirections(sharedAtt, delta) {
	var direction = sharedAtt === 'row' ? 'horizontal' : 'vertical';
	var containerName = `${direction}Path`;
	var paths = {
		'horizontal': {
			'-1': ' left',
			'1': ' right'
		},
		'vertical': {
			'-1': ' top',
			'1': ' bottom'
		}
	};

	var currentsPath = paths[direction][delta * -1];
	var lastsPath = paths[direction][delta];

	return {
		container: containerName,
		current: currentsPath,
		last: lastsPath
	}
}

function erasePath(last, current, sharedAtt, delta) {
	var paths = getPathDirections(sharedAtt, delta);

	current.querySelectorAll(`.${paths.container}`)[0].classList = paths.container;
	var lastClasses = last.querySelectorAll(`.${paths.container}`)[0].className.replace(paths.current, '');

	last.querySelectorAll(`.${paths.container}`)[0].classList = lastClasses;
}

function drawPath(last, current, sharedAtt, delta) {
	var paths = getPathDirections(sharedAtt, delta);

	current.querySelectorAll(`.${paths.container}`)[0].classList += paths.current;
	last.querySelectorAll(`.${paths.container}`)[0].classList += paths.last;
}

function selectCell(cell) {
	cell.classList += ' active';
	selectedCells.push(cell);
}

function deselectCell(cell) {
	cell.classList.remove('active');
	selectedCells.splice(selectedCells.indexOf(cell), 1);
}

function deactivateCell(cell) {
	cell.classList.remove('active');
}

function registerClick(selected) {
	// Make sure first cell selected is a circled letter
	if (selectedCells.length < 1 ) {
		if (selected.className.indexOf('circled') > -1 && !selectedCells.indexOf(selectedCell) > -1) {
			selectCell(selected);
		}
		return
	}
	selectedCell = selected // define newly selected cell
	validateOrClearSelection();
}

function isAlreadySelected() {
	return selectedCells.indexOf(selectedCell) > -1;
}

function validateOrClearSelection() {
	// deselect
	if (isAlreadySelected()) {
		removeLineFromSelected();
	// select
	} else if (areAligned()) {
		addLineToSelected();
		if (selectedCell.className.indexOf('circled') > -1) {
			checkSolution();
		}
	}
}

function areAligned() {
	var lastSelected = selectedCells[selectedCells.length - 1]
	if (lastSelected.attributes.row.value === selectedCell.attributes.row.value) {
		return 'row';
	} else if (lastSelected.attributes.column.value === selectedCell.attributes.column.value){
		return 'column';
	}
	return false;
}

function addLineToSelected() {
	var lastSelected = selectedCells[selectedCells.length - 1];
	var sharedAtt = areAligned();
	var lineDirection = (sharedAtt == 'row') ? 'column' : 'row';
	var lastPosition = parseInt(lastSelected.attributes[lineDirection].value);
	var newPosition = parseInt(selectedCell.attributes[lineDirection].value);

	var delta = lastPosition < newPosition ? 1 : -1;

	for ( i = lastPosition + delta; i != newPosition + delta; i += delta ) {
		var cellInLine = document.querySelector("["+ sharedAtt + "='" + selectedCell.attributes[sharedAtt].value +"']["+ lineDirection + "='" + i +"']");
		selectCell(cellInLine);
		drawPath(lastSelected, cellInLine, sharedAtt, delta);
		lastSelected = cellInLine;
	}
}

function removeLineFromSelected() {
	var lastSelected = selectedCells[selectedCells.length - 1];
	var sharedAtt = areAligned();
	var lineDirection = (sharedAtt == 'row') ? 'column' : 'row';
	var lastPosition = parseInt(lastSelected.attributes[lineDirection].value);
	var newPosition = parseInt(selectedCell.attributes[lineDirection].value);

	var delta = lastPosition < newPosition ? 1 : -1;

	for ( i = lastPosition; i != newPosition; i += delta ) {
		var cellInLine = document.querySelector("["+ sharedAtt + "='" + selectedCell.attributes[sharedAtt].value +"']["+ lineDirection + "='" + i +"']");
		var adjacentIndex = i + delta;
		var adjacentCell = document.querySelector("["+ sharedAtt + "='" + selectedCell.attributes[sharedAtt].value +"']["+ lineDirection + "='" + adjacentIndex +"']");
		deselectCell(cellInLine);
		erasePath(adjacentCell, cellInLine, sharedAtt, delta);
	}
}

function clearAllSelected() {
	var selectedList = document.querySelectorAll('.active');
	var selected = Array.prototype.slice.call(selectedList, 0);
	selected.forEach(function(element) {
		element.classList.remove('active');
	})
	selectedCells.length = 0;
}

function temporarilyDisableEvents() {
	var eventBlocker = document.querySelector('.event-blocker');
	eventBlocker.style.zIndex = 100;

	setTimeout(function() {
		eventBlocker.style.zIndex = -100;
	}, 1000)
}

function checkSolution() {
	temporarilyDisableEvents();

	var guessString = ""
	selectedCells.forEach(function(element) {
		guessString += element.innerText;
	})

	for ( i = 0; i < data.solutions.length; i++) {
		var solutionString = data.solutions[i].join('');
		var backwardsGuessString = guessString.split("").reverse().join("");
		var isBackwards = backwardsGuessString == solutionString;
		if (guessString == solutionString || isBackwards) {
			win(i, isBackwards);
			return;
		}
	}

	lose();
}

function win(index, isBackwards) {
	var congratsModal = document.querySelector('#congrats-modal');
	var answersContainer = congratsModal.querySelector('.answers');

	var puntainer = congratsModal.querySelector('h1');

	if (data.pungratulations) puntainer.innerText = `${data.pungratulations}!`;

	var answerArray = data.solutions[index];
	if (isBackwards) answerArray.reverse();
	var offset = 0;
	answersContainer.innerText += answerArray.join(', ');

	var completedBoard = document.querySelector('.board');
	localStorage.setItem(`${puzzleNumber}-completed`, completedBoard.outerHTML);

	setTimeout(function(){
		openModal('congrats');
	}, 400)
}

function lose() {
	var x = 0;
	window.setTimeout(function() {
		window.setInterval(function() {
			if (x <= 2) flashText();
			x++;
		}, 100)
	}, 200)

	window.setTimeout(function() {
		resetCellColors();
		clearAllSelected();
	}, 750)
}

function flashText() {
	var highlightedCellsList = document.querySelectorAll('.active');
	var highlightedCells = Array.prototype.slice.call(highlightedCellsList, 0);
	highlightedCells.forEach(function(cell) {
		cell.style.backgroundColor = cell.style.backgroundColor == "var(--teal)" ? "#F27376" : "var(--teal)";
	})
}

function resetCellColors() {
	var highlightedCellsList = document.querySelectorAll('.active');
	var highlightedCells = Array.prototype.slice.call(highlightedCellsList, 0);
	highlightedCells.forEach(function(cell) {
		cell.style.backgroundColor = "";
		cell.querySelectorAll('.verticalPath')[0].classList = 'verticalPath';
		cell.querySelectorAll('.horizontalPath')[0].classList = 'horizontalPath';
	})
}


function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

initialize();
