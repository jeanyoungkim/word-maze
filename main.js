// Puzzle Data
// "circled" is 0 indexed
const puzzles = {
	"plants": {
		"warm_up":  {
			"letters": "YTRXBEESUIVUSHYN",
			"circled": [1, 14],
			"solutions": [["TREE", "IVY"]]
		},
		"strong": {
			"letters": "LEPEAWOAESNACSAHULARSRTSMOHIMPTOTSQZ",
			"circled": [2, 33],
			"solutions": [['PEAS', 'ROOTS'], ['PEA', 'SHOOTS']]
		},
		"tough": {
			"letters": "SNASORMIAOPAPGUVIBEGPCOYVEIPLERNUNZZAENSSRAPXLBOFTEBQSEYLYETSZAN",
			"circled": [3, 60],
			"solutions": [['SAGE', 'BONSAI', 'VENUS', 'FLYTRAP', 'BEETS']]
		}
	},
	"fish": {
		"strong": {
			"letters": "NIFILONHSMNODGGUATAILSLQIPIGTACSLLOILEZTHHCNMOUYN",
			"circled": [2, 40],
			"black": [15, 25, 38],
			"solutions": [['FIN', 'TAIL', 'GILL', 'SCALE', 'MOUTH']]
		}
	}
}

let theme = window.theme
let difficulty = window.difficulty

const data = puzzles[theme][difficulty]

const isMobile = mobileCheck()
const eventType = isMobile ? 'touchstart' : 'mouseover'
const selectedCells = []
const letters = data.letters.split('')
let selectedCell

function initialize() {
	renderBoard()
	setUpEventHandlers()
}

function renderBoard() {
	const board = document.querySelector('.board')
	const numRows = Math.sqrt(data.letters.length)
	board.style.width = numRows * 70 + "px";

	for ( i = 0; i < numRows; i++ ) {
		let colNum = 1
		for ( j = numRows * i; j < (numRows * i) + numRows; j++ ) {
				let cell = document.createElement('div')
				cell.className = "cell"
				if (data.circled.includes(j)) cell.className += " circled"
				if (data.black && data.black.includes(j)) cell.className += " black"
				cell.innerHTML = data.letters[j]
				cell.setAttribute("row", i + 1)
				cell.setAttribute("column", colNum)

				if (colNum == numRows) {
					colNum = 1
				} else {
					colNum = colNum + 1
				}

				board.appendChild(cell)
		}
	}
}

function setUpEventHandlers() {
	let cells = document.querySelectorAll('.cell')
		document.addEventListener('click', function(e) {
		if (e.target.tagName == 'BODY') {
			clearAllSelected()
		}
	})

	let eventTypes = ['touchstart', 'touchmove', 'touchend']

	// bind events to individual cells to avoid swipe issues
	cells.forEach(function(cell){
		let isSelectable = !cell.classList.contains('black')
		eventTypes.forEach(function(eventType) {
			cell.addEventListener((eventType), function(e) {
				let element = document.elementFromPoint(e.pageX, e.pageY);
				console.log(element, eventType)
			})
		})
		// cell.addEventListener(eventType, function(e) {
		// 	e.stopPropagation();
		// 	if (isSelectable && e.target.className.includes('cell')) {
		// 		registerClick(e.target)
		// 	} else {
		// 		clearAllSelected()
		// 	}
		// })
	})
}

function activateCell(cell) {
	cell.classList.add('active')
}

function deactivateCell(cell) {
	cell.classList.remove('active')
}

function registerClick(selected) {
	// Make sure first cell selected is a circled letter
	if (selectedCells.length < 1 ) {
		if (selected.className.includes('circled') && !selectedCells.includes(selectedCell)) {
			activateCell(selected)
			selectedCells.push(selected)
		}
		return
	}

	selectedCell = selected // define newly
	validateOrClearSelection()
}

function isAlreadySelected() {
	return selectedCells.includes(selectedCell)
}

function validateOrClearSelection() {
	// deselect
	if (isAlreadySelected()) {
		selectedCells[selectedCells.length - 1].classList.remove('active')
		selectedCells.pop()
	// select
	} else if (isValidMove()) {
		addLineToSelected()
		if (selectedCell.className.includes('circled')) {
			checkSolution()
		}
	// clear all
	} else {
		clearAllSelected()
	}
}

function isValidMove() {
	return areAligned()
}

function areAligned() {
	let lastSelected = selectedCells[selectedCells.length - 1]
	if (lastSelected.attributes.row.value === selectedCell.attributes.row.value && Math.abs(lastSelected.attributes.column.value - selectedCell.attributes.column.value) == 1) {
		return 'row'
	} else if (lastSelected.attributes.column.value === selectedCell.attributes.column.value && Math.abs(lastSelected.attributes.row.value - selectedCell.attributes.row.value) == 1){
		return 'column'
	}

	return false
}

function addLineToSelected() {
	let lastSelected = selectedCells[selectedCells.length - 1]
	let sharedAtt = areAligned()
	let lineDirection = (sharedAtt == 'row') ? 'column' : 'row'
	let lastPosition = parseInt(lastSelected.attributes[lineDirection].value)
	let newPosition = parseInt(selectedCell.attributes[lineDirection].value)

	let delta = lastPosition < newPosition ? 1 : -1

	for ( i = lastPosition + delta; i != newPosition + delta; i += delta ) {
		let cellInLine = document.querySelector("["+ sharedAtt + "='" + selectedCell.attributes[sharedAtt].value +"']["+ lineDirection + "='" + i +"']")
		cellInLine.className += ' active'
		selectedCells.push(cellInLine)
	}
}

function clearAllSelected() {
	document.querySelectorAll('.active').forEach(function(element) {
		element.classList.remove('active')
	})
	selectedCells.length = 0
}

function temporarilyDisableEvents() {
	let eventBlocker = document.querySelector('.event-blocker')
	eventBlocker.style.zIndex = 100;

	setTimeout(function() {
		eventBlocker.style.zIndex = -100;
	}, 1000)
}

function checkSolution() {
	temporarilyDisableEvents()

	let guessString = ""
	selectedCells.forEach(function(element) {
		guessString += element.innerHTML
	})

	for ( i = 0; i < data.solutions.length; i++) {
		let solutionString = data.solutions[i].join('')
		let backwardsGuessString = guessString.split("").reverse().join("")
		let isBackwards = backwardsGuessString == solutionString
		if (guessString == solutionString || isBackwards) {
			win(i, isBackwards)
			return
		}
	}

	lose()
}

function win(index, isBackwards) {
	let answersContainer = document.querySelector('.answers')
	let answerArray = data.solutions[index]
	// clone selected cell nodes
	let selectedCellsCopy = []
	selectedCells.forEach(function(cell) {
		let cellClone = cell.cloneNode(true)
		selectedCellsCopy.push(cellClone)
	})

	if (isBackwards) selectedCellsCopy.reverse()

	let offset = 0
	answerArray.forEach(function(text, index) {
		let singleAnswer = document.createElement('div')
		// let offset = index == 0 ? 0 : answerArray[index - 1].length
		let tiles = selectedCellsCopy.slice(offset, offset + text.length)
		offset += text.length

		singleAnswer.className = 'answer'

		tiles.forEach(function(tile) {
			singleAnswer.appendChild(tile)
		})
		answersContainer.appendChild(singleAnswer)
	})

	setTimeout(function(){
		showCongratsModal()
	}, 400)
}

function showCongratsModal() {
	let congrats = document.querySelector('.congratulations')
	congrats.style.display = "flex"
}

function lose() {
	let x = 0
	window.setTimeout(function() {
		window.setInterval(function() {
			if (x <= 2) flashText()
			x++
		}, 100)
	}, 200)

	window.setTimeout(function() {
		resetCellColors()
		clearAllSelected()
	}, 750)
}

function flashText() {
	let highlightedCells = document.querySelectorAll('.active')
	highlightedCells.forEach(function(cell) {
		cell.style.borderColor = cell.style.borderColor == "" ? "#F27376" : ""
	})
}

function resetCellColors() {
	let highlightedCells = document.querySelectorAll('.active')
	highlightedCells.forEach(function(cell) {
		cell.style.borderColor = ""
	})
}


function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

initialize()
