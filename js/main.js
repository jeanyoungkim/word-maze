// Puzzle Data
// "circled" is 0 indexed
var puzzles = {
	"tutorial": {
		"swipe": {
			"letters": "SWIPEFROMSTOS",
			"circled":[0,12],
			"solutions": [["SWIPE", "FROM", "S", "TO", "S"]],
			"width": 13,
			"height": 1
		},
		"title": {
			"letters": "THISISWORDMAZE",
			"circled":[0, 13],
			"solutions": [["THIS", "IS", "WORD", "MAZE"]],
			"width": 14,
			"height" : 1
		},
		"down":{
			"letters": "YOUCANGODZZZZZZZZZZZOZZZZZZZZZZZWZZZZZZZZZZZNTOO",
			"circled":[0, 47],
			"black": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
			"solutions": [["YOU", "CAN", "GO", "DOWN", "TOO"]],
			"width" : 12,
			"height": 4
		},
	},
	"plants": {
		"warm_up":  {
			"letters": "YTRXBEESUIVUSHYN",
			"circled": [1, 14],
			"solutions": [["TREE", "IVY"], ["TREE", "BUSH", "IVY"]],
			"width":4,
			"height":4
		},
		"strong": {
			"letters": "LEPEAWOAESNACSAHULARSRTSMOHIMPTOTSQZ",
			"circled": [2, 33],
			"solutions": [['PEAS', 'ROOTS'], ['PEA', 'SHOOTS']],
			"width":6,
			"height":6
		},
		"tough": {
			"letters": "SNASORMIAOPAPGUVIBEGPCOYVEIPLERNUNZZAENSSRAPXLBOFTEBQSEYLYETSZAN",
			"circled": [3, 60],
			"solutions": [['SAGE', 'BONSAI', 'VENUS', 'FLYTRAP', 'BEETS']],
			"width":8,
			"height":8
		}
	},
	// put placeholder letters in for the black squares
	"fish": {
		"strong": {
			"letters": "NIFILONHSMNODGGUATAILSLQIPIGTACSLLOILEZTHHCNMOUYN",
			"circled": [2, 40],
			"black": [15, 25, 38],
			"solutions": [['FIN', 'TAIL', 'GILL', 'SCALE', 'MOUTH']],
			"width":7,
			"height":7
		}
	},
	"shortzian": {
		"meow": {
			"letters": "IXIMWOLIKERECIEVMMKHCIEXELILOINIKEWM",
			"circled": [0, 1],
			"solutions": [["I", "LIKE", "CHICKEN", "I", "LIKE", "LIVER", "MEOW", "MIX", "MEOW", "MIX"]],
			"width":6,
			"height":6
			}
	},
	"color": {
             "strong": {
                     "letters": "REDOCGEYEPRURANOLLLEPELNEOWOBRULBERGNWOKMAGENBLACIOURTIPETSEQRANLANATSUTKLAVENDER",
                     "circled": [0, 80],
                     "solutions": [['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'BROWN', 'BLACK', 'MAGENTA', 'TURQUOISE', 'TAN', 'TEAL', 'PINK', 'LAVENDER'],
                                    ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'BROWN', 'BLACK', 'MAGENTA', 'TURQUOISE', 'TAN', 'TEAL', 'LAVENDER']],
		     "width":9,
		     "height":9
            }
       },
	"palindrome": {
		"napoleon": {
		 	 "letters": "RLILBANANNALDGCCAWEYEEESIPIGCWCELLOAATREISRABLEWA",
			 "circled": [5, 43],
			 "black": [15, 33],
			 "solutions": [['ABLE', 'WAS', 'I', 'ERE', 'I', 'SAW', 'ELBA']],
			 "width":7,
			 "height":7
			}
	}
};

var style = window.style;
var name = window.name;

var data = puzzles[style][name];

var isMobile = mobileCheck();
var eventType = isMobile ? 'touchstart' : 'mouseover';
var selectedCells = [];
var letters = data.letters.split('');
var selectedCell;

function initialize() {
	renderBoard();
	setUpEventHandlers();
}

function renderBoard() {
	var board = document.querySelector('.board');
	var numRows = data.height;
	var numColumns = data.width;
	var cellWidth = isMobile && numRows > 4 ? (window.innerWidth - 20)/(numRows + 1) : 60;
	var boardIsBiggerThanWindow = cellWidth * numColumns > window.innerWidth;
	board.style.width = isMobile && numColumns > 4 ? window.innerWidth - 20 + "px" : numColumns * (cellWidth + 10) + "px";

	for ( i = 0; i < numRows; i++ ) {
		var colNum = 1;
		for ( j = numColumns * i; j < (numColumns * (i + 1)); j++ ) {
				var cell = document.createElement('div');
				cell.className = "cell";
				cell.style.animationPlayState = "paused";
				cell.style.width = cellWidth + "px";
				cell.style.height = cellWidth + "px";
				cell.style.transform = 'scale(' + Math.random() + ')';
				cell.style.animationPlayState = "running";
				cell.addEventListener("animationend", function() { this.style.transform = 'scale(1)';});
				if (data.circled.indexOf(j) > -1) cell.className += " circled";
				if (data.black && data.black.indexOf(j) > -1) {
					cell.className = 'black';
					board.appendChild(cell);
				} else {
					cell.innerHTML = data.letters[j];
					cell.setAttribute("row", i + 1);
					cell.setAttribute("column", colNum);
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

function setUpEventHandlers() {
	var cellsNodeList = document.querySelectorAll('.cell');
	var cells = Array.prototype.slice.call(cellsNodeList, 0);
	document.addEventListener('click', function(e) {
		if (e.target.tagName == 'BODY') {
			clearAllSelected();
		}
	})

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

function activateCell(cell) {
	cell.classList.add('active');
}

function deactivateCell(cell) {
	cell.classList.remove('active');
}

function registerClick(selected) {
	// Make sure first cell selected is a circled letter
	if (selectedCells.length < 1 ) {
		if (selected.className.indexOf('circled') > -1 && !selectedCells.indexOf(selectedCell) > -1) {
			activateCell(selected);
			selectedCells.push(selected);
		}
		return
	}
console.log(selected);
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
		// selectedCells[selectedCells.length - 1].classList.remove('active');
		// selectedCells.pop();
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
console.log("not aligned");
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
		cellInLine.className += ' active';
		selectedCells.push(cellInLine);
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
		selectedCells.splice(selectedCells.indexOf(cellInLine), 1);
		cellInLine.classList.remove('active');
		// selectedCells.push(cellInLine);
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
		guessString += element.innerHTML;
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
	var answersContainer = document.querySelector('.answers');
	var answerArray = data.solutions[index];
	// clone selected cell nodes
	var selectedCellsCopy = [];
	selectedCells.forEach(function(cell) {
		var cellClone = cell.cloneNode(true);
		selectedCellsCopy.push(cellClone);
	})

	if (isBackwards) selectedCellsCopy.reverse();

	var offset = 0;
	answerArray.forEach(function(text, index) {
		var singleAnswer = document.createElement('div');
		// var offset = index == 0 ? 0 : answerArray[index - 1].length
		var tiles = selectedCellsCopy.slice(offset, offset + text.length);
		offset += text.length;

		singleAnswer.className = 'answer';

		tiles.forEach(function(tile) {
			singleAnswer.appendChild(tile);
		})
		answersContainer.appendChild(singleAnswer);
	})

	setTimeout(function(){
		showCongratsModal();
	}, 400)
}

function showCongratsModal() {
	var congrats = document.querySelector('.congratulations');
	congrats.style.display = "flex";
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
		cell.style.borderColor = cell.style.borderColor == "" ? "#F27376" : "";
	})
}

function resetCellColors() {
	var highlightedCellsList = document.querySelectorAll('.active');
	var highlightedCells = Array.prototype.slice.call(highlightedCellsList, 0);
	highlightedCells.forEach(function(cell) {
		cell.style.borderColor = "";
	})
}


function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

initialize();
