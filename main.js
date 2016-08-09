// Puzzle Data
// Tough
// const letters = "SNASORMIAOPAPGUVIBEGPCOYVEIPLERNUNZZAENSSRAPXLBOFTEBQSEYLYETSZAN"
// const data = {
// 	"rows": 8,
// 	"letters": letters.split(''),
// 	"circled": [3, 60]
// };

// Strong
const letters = "LEPEAWOAESNACSAHULARSRTSMOHIMPTOTSQZ"
const data = {
	"rows": 6,
	"letters": letters.split(''),
	"circled": [2, 33],
	"solution": ['PEAS', 'ROOTS']
};

// const pageWidth = document.documentElement.clientWidth
// console.log(pageWidth)

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
