//Denisa Vataksi
// app.js
/*eslint no-use-before-define: ["error", { "functions": false }]*/
const rev = require('./reversi.js');
const readLineSync = require("readline-sync");

const fs = require('fs');

console.log("REVERSI?\n");
//check for config filex
if (process.argv[2]) {
	fs.readFile(process.argv[2],'utf8',function(err,data){
		if(err)
			{console.log("ooof ", err);}
		else{
			const object = JSON.parse(data);
			const player = object.boardPreset.playerLetter;
			const computer = (player === "X") ? "O" : "X";
			let board = [...object.boardPreset.board];
			const playersScriptedMoves = [...object.scriptedMoves.player];
			const computersScriptedMoves = [...object.scriptedMoves.computer];
			const playersTurn = (player === "X") ? true: false;
			board = playScript(board, player, computer, playersTurn, playersScriptedMoves, computersScriptedMoves);
			if(rev.getLetterCounts(board).X === player)
				{console.log("You won!");}
			else
				{console.log("Computer won :/");}
		}
	});
}
else{ //new game
	let player;
	let board = constructBoard();

	do{
		player = readLineSync.question("Pick your letter: X (black) or O (white)\n");
	}while(player !== "X" && player !== "O");
	const computer = (player === "X") ? "O" : "X";
	const playerGoesFirst = (player === "X") ? true: false;
	console.log("Player is ", player);

	console.log(rev.boardToString(board));
	board = play(board, player, computer, playerGoesFirst);
	if(rev.getLetterCounts(board).X === player)
		{console.log("You won!");}
	else
		{console.log("Computer won :/");}
}
function constructBoard(){
	let width;
	do{
		width = readLineSync.question("How wide should the board be? (even numbers between 4 and 26, inclusive)\n");
	}
	while(width % 2 !== 0 ||width < 4 || width > 26);

	let board = rev.generateBoard(width, width);
	board = rev.setBoardCell(board, "O", (width/2) - 1, (width/2) - 1);
	board = rev.setBoardCell(board, "O", (width/2), (width/2));
	board = rev.setBoardCell(board, "X", (width/2) - 1, (width/2));
	board = rev.setBoardCell(board, "X", (width/2), (width/2) - 1);

	return board;
}
function play(board, player, computer, playersTurn){
	let computerPasses = 0;
	let playerPasses = 0;
	while(!rev.isBoardFull(board) && playerPasses < 2 && computerPasses < 2){
		if(playersTurn){
			const play = playersMove(board, player, playerPasses);
			playerPasses = play.passes;
			board = play.board;
			if(playerPasses === 2){			
				console.log("Game over\n");
				console.log(rev.boardToString(board));
				getScore(board);
				return board;
			}
		}
		else{
			const play = computersMove(board, computer, computerPasses);
			computerPasses = play.passes;
			board = play.board;
			computerPasses = play.passes;
			if(computerPasses === 2){
				console.log("Game over\n");
				console.log(rev.boardToString(board));
				getScore(board);
				return board;
			}
		}
		console.log(rev.boardToString(board));
		getScore(board);
		playersTurn = !playersTurn;
	}
	return board;
}

function playersMove(board, player, passes){
	const validMoves = rev.getValidMoves(board, player);
	if(validMoves.length === 0){
		console.log("No valid moves available for you.\n",
			"Press <ENTER> to pass\n");
		passes++;
	}
	else{
		let move;
		do{
			move = readLineSync.question("What's your move?\n");
			if(!rev.isValidMoveAlgebraicNotation(board, player, move)){
				console.log("INVALID MOVE. Your move should:\n", 
					"* be in a format\n",
					"* specify an existing empty cell\n",
					"flip at least one of your opponent's pieces\n");
			}
		}while(!rev.isValidMoveAlgebraicNotation(board, player, move));
		board = rev.placeLetters(board, player, move);
		board = rev.flipCells(board, rev.getCellsToFlip(board, rev.algebraicToRowCol(move).row, rev.algebraicToRowCol(move).col));
		passes = 0;
	}
	return {board: board,
		passes: passes};
}

function computersMove(board, computer, passes){
	const validMoves = rev.getValidMoves(board, computer);
	if(validMoves.length === 0){
		console.log("No valid moves available for the computer. Computer passes.\n",
			"Press <ENTER>\n");
		passes++;
	}
	else{
		const move = validMoves[Math.floor(Math.random() * validMoves.length)];
		board = rev.setBoardCell(board, computer, move[0], move[1]);
		board = rev.flipCells(board, rev.getCellsToFlip(board, move[0], move[1]));
		readLineSync.question("Press <ENTER> to show computer's move ...\n");
		passes = 0;
	}
		return {board: board,
			passes: passes};
}
function playScript(board, player, computer, playersTurn, playersScriptedMoves, computersScriptedMoves){
	let computerPasses = 0;
	let playerPasses = 0;
	console.log("\nScripted Moves left for Player: ", playersScriptedMoves);
	console.log("Scripted Moves left for Computer", computersScriptedMoves);
	console.log("Player is ", player);
	console.log(rev.boardToString(board));
	while(!rev.isBoardFull(board) && (playersScript.length !== 0 || computersScript !== 0)){
		if(playersTurn){
			const play = playersScript(board, player, playersScriptedMoves);
			board = play.board;
			playersScriptedMoves = play.playersScriptedMoves;
			playerPasses = play.passes;
			if(playerPasses === 2){
				console.log("Game over\n");
				console.log(rev.boardToString(board));
				getScore(board);
				return board;
			}
		}
		else{
			const play = computersScript(board, computer, computersScriptedMoves);
			board = play.board;
			computersScriptedMoves = play.computersScriptedMoves;
			computerPasses = play.passes;
			if(computerPasses === 2){
				console.log("Game over\n");
				console.log(rev.boardToString(board));
				getScore(board);
				return board;
			}
		}
		console.log(rev.boardToString(board));
		getScore(board);
		playersTurn = !playersTurn;
	}
	//play normally
	board = play(board, player, computer, playersTurn);
	return board;
}
function playersScript(board, player, playersScriptedMoves, passes){
	const nextMove = playersScriptedMoves[0];
	if(playersScriptedMoves !==0 && rev.isValidMoveAlgebraicNotation(board, player, nextMove)){
		const nextMoveRowCol = rev.algebraicToRowCol(nextMove);
		console.log("Player move to ", nextMove, " is scripted.");
		readLineSync.question("Press <ENTER> to continue");
		board = rev.setBoardCell(board, player, nextMoveRowCol.row, nextMoveRowCol.col);
		board = rev.flipCells(board, rev.getCellsToFlip(board, nextMoveRowCol.row, nextMoveRowCol.col));
		passes = 0;
	}
	else{
		const play = playersMove(board, player, 0);
		board = play.board;
		passes = play.passes;
	}return{
			playersScriptedMoves: playersScriptedMoves.splice(-1,1),
			board: board,
			passes:passes
		};	
}
function computersScript(board, computer, computersScriptedMoves, passes){
	const nextMove = computersScriptedMoves[0];
	if(computersScriptedMoves !== 0 && rev.isValidMoveAlgebraicNotation(board, computer, nextMove)){
		const nextMoveRowCol = rev.algebraicToRowCol(nextMove);
		console.log("Computer move to ", nextMove, " is scripted.");
		readLineSync.question("Press <ENTER> to show computer's move...");
		board = rev.setBoardCell(board, computer, nextMoveRowCol.row, nextMoveRowCol.col);
		board = rev.flipCells(board, rev.getCellsToFlip(board, nextMoveRowCol.row, nextMoveRowCol.col));
		passes = 0;
	}
	else{
		const play = computersMove(board, computer, 0);
		board = play.board;
		passes = play.passes;
	}
	return{
			computersScriptedMoves: computersScriptedMoves.splice(-1,1),
			board: board,
			passes: passes
		};	
}

function getScore(board){
	console.log("Score");
	console.log("=====");
	console.log("X: ", rev.getLetterCounts(board).X,
		"\nO: ", rev.getLetterCounts(board).O, "\n");
}





