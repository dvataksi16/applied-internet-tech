// rev.js

const rev = {

//creates an Array that contains value as each element for n elements. 
	repeat: function (value, n){
		const array = [];
		for(let i = 0; i < n; i++){
			array.push(value);
		}
		return array;
	},
/*Creates a single dimensional Array representation of a rev board. 
   the number of elements in the Array is the same as the number of squares in the board 
    based on the supplied number of rows and cols. */
	generateBoard: function(rows, cols, initialCellVaue){
		if(initialCellVaue)
			{return rev.repeat(initialCellVaue, rows * cols);}
		else
			{return rev.repeat(" ", rows * cols);}
	},
/*translates a row and a col into an index in the one dimensional 
	Array representation of a rev board.*/
	rowColToIndex: function(board, rowNumber, colNumber){
		const rowSize = Math.sqrt(board.length);
		return (rowSize * rowNumber) + colNumber; 
	},

	/*Translates a single index in a one dimensional Array representation of a board 
	to that cell's row and col.*/
	indexToRowCol: function(board, i){
		const size = Math.sqrt(board.length);
		const res = {};
		res.row = Math.floor(i / size);
		res.col= i % size;
		return res;
	},
	/*Sets the value of the cell at the specified row and col numbers on the board, board, to the value, 
	letter without mutating the original board passed in.*/
	setBoardCell: function(board, letter, row, col){
		const boardCopy = [...board];
		const index = rev.rowColToIndex(boardCopy, row, col);
		boardCopy[index] = letter;
		return boardCopy;
	},
	/*Translates algebraic notation specifying a cell into a row and col specifying the same cell. 
	If the notation passed in is not valid, then return undefined.*/
	algebraicToRowCol: function(algebraicNotation) {
		function isNumber(n) {
			const num = Math.floor(Number(n));
			return String(num) === n && num >= 0;
		}
		function isLetter(l) {
			if(l === undefined)
				{return undefined;}
			return l.length === 1 && l.match(/[A-Z]/);
		}

		const res = {};
		if (isLetter(algebraicNotation[0]) && isNumber(algebraicNotation.substring(1))){
			const row = parseInt(algebraicNotation.substring(1))-1;
			const column = algebraicNotation.charCodeAt(0) - 65;
			res.row = row;
			res.col = column;
			return res;
		}
		else{
			return undefined;
		}
	},
	/*Translates one or more moves in algebraic notation to row and col… and uses the row and col to 
	set the letter specified on the board.*/
	placeLetters: function(board, letter, ...algebraicNotation){
		let boardCopy = [...board];
		for(const arg of algebraicNotation){
			const rowCol = rev.algebraicToRowCol(arg);
			if(rowCol !== undefined)
				{boardCopy = rev.setBoardCell(boardCopy,letter,rowCol.row, rowCol.col);}
		}
		return boardCopy;
	},
	//Creates a text drawing representation of the Tic Tac Toe board passed in
	boardToString: function(board){
		const dimension = Math.sqrt(board.length);
		let result = "   ";
		let horizontalBorder = "  ";
		for(let i = 0; i < dimension; i++){
			result += "  " + String.fromCodePoint(65 + i) + " ";
		}
		result += " \n ";
		
		for (let i = 0; i < dimension; i++) {
			horizontalBorder += "+---";
			if (i === dimension - 1)
				{horizontalBorder += "+";}
		}
		result += horizontalBorder + "\n ";
		for (let i = 0; i < dimension; i++) {
			result +=(i+1) + " ";
			for (let j = 0; j < dimension; j++) {
				result += "| " + board[dimension * i + j] + " ";
				if (j === dimension - 1)
					{result += "|";}	
			}
			result += "\n ";
			if(i !== dimension -1)
				{result += horizontalBorder + "\n ";}
			else
				{result += horizontalBorder + "\n";} 
		}
		return result;
	},
	//Examines the board passed in to determine whether or not it's full.
	isBoardFull: function(board){
		for(let i = 0; i < board.length; i++){
			if(board[i] === " ")
				{return false;}
		}
		return true;
	},
	/*Using the board passed in, flip the piece at the specified row and col so that it is the opposite color 
	by changing X to O or O to X. 
	If no letter is present, there is no change to that cell.*/
	flip: function(board, row, col){
		const index = rev.rowColToIndex(board, row, col);
		const boardCopy = [...board];
		if(board[index] === "X")
			{boardCopy[index] = "O";}
		else if(board[index] === "O")
			{boardCopy[index] = "X";}
		return boardCopy;
	},
	//Using the board passed in, flip the pieces in the cells specified by cellsToFlip.
	flipCells: function(board, cellsToFlip){
		let boardCopy = [...board];
		for(let i = 0; i < cellsToFlip.length; i++){
			for(let j = 0; j < cellsToFlip[i].length; j++)
				{
					boardCopy = rev.flip(boardCopy, cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
			}

		}	
		
		return boardCopy;
	},
	//Determines which cells contain pieces to flip based on the last move. 
	getCellsToFlip: function(board, lastRow, lastCol){
		const result = [];
		
		//left
		const left = rev.getCellsToFlipUtility(board, lastRow, lastCol, 0, -1);
		if(left.length > 0)
			{result.push(left);}
		//right
		const right = rev.getCellsToFlipUtility(board, lastRow, lastCol, 0, 1);
		if(right.length > 0)
			{result.push(right);}
		//up
		const up = rev.getCellsToFlipUtility(board, lastRow, lastCol, -1, 0);
		if(up.length > 0)
			{result.push(up);}
		//down
		const down = rev.getCellsToFlipUtility(board, lastRow, lastCol, 1, 0);
		if(down.length > 0)
			{result.push(down);}
		//upper left diagonal
		const upperLeft = rev.getCellsToFlipUtility(board, lastRow, lastCol, -1, -1);
		if(upperLeft.length > 0)
			{result.push(upperLeft);}
		//upper right diagonal
		const upperRight = rev.getCellsToFlipUtility(board, lastRow, lastCol, -1, 1);
		if(upperRight.length > 0)
			{result.push(upperRight);}
		//lower left diagonal
		const lowerLeft = rev.getCellsToFlipUtility(board, lastRow, lastCol, 1, -1);
		if(lowerLeft.length > 0)
			{result.push(lowerLeft);}
		//lower right diagonal
		const lowerRight = rev.getCellsToFlipUtility(board, lastRow, lastCol, 1, 1);
		if(lowerRight.length > 0)
			{result.push(lowerRight);}
		return result;	
	},
	getCellsToFlipUtility: function(board, lastRow, lastCol, rowDirection, colDirection){
		const dimension = Math.sqrt(board.length);
		const result = [];
		const lastPlay = board[rev.rowColToIndex(board, lastRow, lastCol)];
		let bounded = true;
		while(bounded){
			lastRow += rowDirection;
			lastCol += colDirection;
			if(lastRow < 0 || lastRow === dimension || lastCol < 0 || lastCol === dimension){
				bounded = false;
				return [];
			}
			if(board[rev.rowColToIndex(board, lastRow, lastCol)] === " ")
				{return [];}
			if(board[rev.rowColToIndex(board, lastRow, lastCol)] === lastPlay)
				{return result;}
			result.push([lastRow,lastCol]);
		}
		return result;


	},
	//Using the board passed in, determines whether or not a move with letter to row and col is valid.
	isValidMove: function(board, letter, row, col){
		const index = rev.rowColToIndex(board, row, col);
		
		//targets an empty square
		if(board[index] !== " ")
			{return false;}
		//is within the boundaries of the board
		if(index >= board.length || index < 0)
			{return false;}
		/*adheres to the rules of rev… that is, the piece played must 
		flip at least one of the other player's pieces*/
		const boardCopy = [...board];
		boardCopy[index] = letter;
		if(rev.getCellsToFlip(boardCopy, row, col).length === 0)
			{return false;}
		else
			{return true;}
	},
	//Using the board passed in, determines whether or not a move with letter to algebraicNotation is valid. 
	isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation){
		const obj = rev.algebraicToRowCol(algebraicNotation);
		if(obj === undefined)
			{return false;}
		return rev.isValidMove(board, letter, obj.row, obj.col);
	},
	//Returns the counts of each of the letters on the supplied board.
	getLetterCounts: function(board){
		let x = 0; let o = 0;
		const res = {};
		for(let i = 0; i < board.length; i++){
			if(board[i] === "X")
				{x++;}
			else if(board[i] === "O")
				{o++;}
		}
		res.X = x;
		res.O = o;
		return res;
	},
	//Gives back a list of valid moves that the letter can make on the board.
	getValidMoves: function(board, letter){
		const result = [];
		for(let i = 0; i < board.length; i++){
			const rowCol = rev.indexToRowCol(board, i);
			if(rev.isValidMove(board, letter, rowCol.row, rowCol.col)){
				result.push([rowCol.row, rowCol.col]);
			}
		}
		return result;
	},

};
module.exports = rev;
