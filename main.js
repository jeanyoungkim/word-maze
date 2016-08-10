// Puzzle Data
// Tough
// const letters = "SNASORMIAOPAPGUVIBEGPCOYVEIPLERNUNZZAENSSRAPXLBOFTEBQSEYLYETSZAN"
// const data = {
// 	"rows": 8,
// 	"letters": letters.split(''),
// 	"circled": [3, 60],
// 	"solutions": [[]]
// };

// Strong
const letters = "LEPEAWOAESNACSAHULARSRTSMOHIMPTOTSQZ"
const data = {
	"rows": 6,
	"letters": letters.split(''),
	"circled": [2, 33],
	"solutions": [['PEAS', 'ROOTS'], ['PEA', 'SHOOTS']]
};

const selectedCells = []
let selectedCell

function renderBoard() {
	const board = document.querySelector('.board')
	board.style.width = data.rows * 70 + "px";

	for ( i = 0; i < data.rows; i++ ) {
		let colNum = 1
		for ( j = data.rows * i; j < (data.rows * i) + data.rows; j++ ) {
				let cell = document.createElement('div')
				cell.className = "cell"
				if (data.circled.includes(j)) cell.className += " circled"
				cell.innerHTML = data.letters[j]
				cell.setAttribute("row", i + 1)
				cell.setAttribute("column", colNum)

				if (colNum == data.rows) {
					colNum = 1
				} else {
					colNum = colNum + 1
				}

				board.appendChild(cell)
		}
	}

	document.addEventListener('click', function(e) {
		if (e.target.className.includes('cell')) {
			registerClick(e.target)
		} else {
			clearAllSelected()
		}
	})
}

function registerClick(selected) {
	// Make sure first cell selected is a circled letter
	if (selectedCells.length < 1 ) {
		if (selected.className.includes('circled')) {
			selected.className += ' active'
			selectedCells.push(selected)
		}
		return
	}

	// Don't double select
	if (selectedCells.includes(selected)) return

	selectedCell = selected // define newly
	validateOrClearSelection()
	// [row, col, val]
	//[selected.attributes.row.value, selected.attributes.column.value, selected.innerHTML]
}

function validateOrClearSelection() {
	if (isValidMove(selectedCell)) {
		addLineToSelected(selectedCell)
		if (selectedCell.className.includes('circled')) {
			checkSolution()
		}
	} else {
		clearAllSelected()
	}
}

function isValidMove() {
	return areAligned()
	// return areInSameRow() || areInSameColumn()
}

function areAligned() {
	let lastSelected = selectedCells[selectedCells.length - 1]
	if (lastSelected.attributes.row.value === selectedCell.attributes.row.value) {
		return 'row'
	} else if (lastSelected.attributes.column.value === selectedCell.attributes.column.value){
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

function checkSolution() {
	let guessString = ""
	selectedCells.forEach(function(element) {
		guessString += element.innerHTML
	})

	for ( i = 0; i < data.solutions.length; i++) {
		let solutionString = data.solutions[i].join('')
		let backwardsGuessString = guessString.split("").reverse().join("")
		if (guessString == solutionString || backwardsGuessString == solutionString) {
			window.setTimeout(win, 100)
			return
		}
	}

	window.setTimeout(function() {
		clearAllSelected()
	}, 500)
}

function win() {
	alert('yay!')
}

renderBoard()
