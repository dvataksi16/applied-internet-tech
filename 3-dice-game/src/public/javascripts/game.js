function main(){

	/*
	* links to dice display pictures -- css extra credit
	*/
	const diceDictionary = [
		"https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png",
		"https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png",
		"https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png",
		"https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png",
		"https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png",
		"https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png"];

	let pinnedCount = 0;
	let computerResult;
	let humanResult = 0;

	const goButton = document.querySelector('button');
	const gameElement = document.getElementById('game');

	const linebreak = document.createElement('br');
	let diceRolls = [];
	const computerPins = [];
	let computerScoreResult = "Computer Score: ";

	const computerScore = document.createElement('div');
	computerScore.className = 'hidden';

	gameElement.appendChild(computerScore);
	gameElement.appendChild(linebreak);

	const yourScore = document.createElement('div');
	yourScore.className = 'yourScore';
	yourScore.appendChild(document.createTextNode('Your Score: 0'));

	gameElement.appendChild(yourScore);

	//if user wins
	const winner = document.createElement('div');
	winner.classList.add('win');
	winner.classList.add('hidden');
	winner.appendChild(document.createTextNode('You Won!'));
	gameElement.appendChild(winner);

	//if user loses
	const loser = document.createElement('div');
	loser.classList.add('lose');
	loser.classList.add('hidden');
	loser.appendChild(document.createTextNode('You Lost!'));
	gameElement.appendChild(loser);

	//ties
	const tie = document.createElement('div');
	tie.classList.add('tie');
	tie.classList.add('hidden');
	tie.appendChild(document.createTextNode("It's a tie!"));
	gameElement.appendChild(tie);


	for(let i = 0; i < 5; i++){
		const numberDisplay = document.createElement('div');
		const diceImage = document.createElement('img');
		numberDisplay.className = 'box';
		numberDisplay.classList.add('mouseOver');
		numberDisplay.classList.add('empty-box');
		numberDisplay.appendChild(diceImage);
		gameElement.appendChild(numberDisplay);
	}

	const startButton = document.createElement('button');
	startButton.innerHTML = 'Start';
	const rollButton = document.createElement('button');
	rollButton.innerHTML = "Roll";
	rollButton.disabled = true;
	const pinButton = document.createElement('button');
	pinButton.innerHTML = 'Pin';
	pinButton.disabled = true;
	const restartButton = document.createElement('button');
	restartButton.innerHTML = "Restart";
	restartButton.disabled = true;


	gameElement.appendChild(linebreak);
	gameElement.appendChild(startButton);
	gameElement.appendChild(rollButton);
	gameElement.appendChild(pinButton);
	gameElement.appendChild(restartButton);

	const diceBoxes = document.querySelectorAll('.box');

	//error screen for when at least one dice isn't pinned
	let pinned = false; //at least one dice must be pinned
	const errorScreen = document.querySelector('#error-message');
	//Ok Got It button should show
	errorScreen.querySelector('p').appendChild(document.createTextNode('Choose at least one die to pin'));
	document.querySelector('#content').appendChild(errorScreen);

	const okGotItButton = document.querySelector('.closeButton');
	errorScreen.classList.add('hidden');

	function updateScore(update){
		let scoreAddition = parseInt(update);
		if(scoreAddition === 3){
			scoreAddition = 0;
		}
		humanResult += scoreAddition;
		yourScore.innerHTML = "Your Score: " + humanResult;
	}

	goButton.addEventListener('click', function(event) {
		console.log('go button clicked');
		event.preventDefault();

		//gather input
		const input = document.querySelector('#diceValues').value;
		console.log('input is',input);
		if(input !== ""){
			diceRolls = input.split(',');
			for(let i = 0; i < diceRolls.length; i++){
				diceRolls[i] = parseInt(diceRolls[i]);
			}
		}
		for(let i = diceRolls.length; i < 15; i ++){
			diceRolls.push(Math.floor(Math.random() * 6) + 1);
		}

		//change all 3s to 0s
		for(let i = 0; i < diceRolls.length; i++){
			diceRolls[i] = (diceRolls[i] === 3) ? 0 : diceRolls[i];
		}
		//console.log(diceRolls);

		//first roll
		computerPins.push(Math.min.apply(null, diceRolls.slice(0,5)));
		//second
		computerPins.push(Math.min.apply(null, diceRolls.slice(5,9)));
		//third
		computerPins.push(Math.min.apply(null, diceRolls.slice(9,12)));
		//fourth
		computerPins.push(Math.min.apply(null, diceRolls.slice(12,14)));
		//fifth
		computerPins.push(diceRolls[14]);
		//console.log(computerPins);

		computerResult = computerPins.reduce(function(a, b) { 
			return a + b; 
		}, 0);
		for(let i = 0 ; i < computerPins.length - 1; i++){
			computerScoreResult += computerPins[i];
			if(computerPins[i] === 0){
				computerScoreResult += ' (3)';
			}
			computerScoreResult += ' + ';
		}
		computerScoreResult += (computerPins[computerPins.length - 1] + ' = ' + computerResult);
		//console.log(computerScoreResult);
		computerScore.appendChild(document.createTextNode(computerScoreResult));

		document.querySelector('#intro').classList.add('hidden');
		gameElement.classList.remove('hidden');
	}, false);


	startButton.addEventListener('click',function() {
		console.log('start button clicked');
		pinButton.disabled = false;
		startButton.classList.add('hidden');
		computerScore.classList.remove('hidden');
		for(let i = 0; i < 5; i ++){
			const firstElement = diceRolls.shift();
			diceBoxes[i].innerHTML = firstElement === 0 
			? 3 : firstElement ;
			diceBoxes[i].style.backgroundImage = "url('" + diceDictionary[parseInt(diceBoxes[i].innerHTML)-1] + "')";
			diceBoxes[i].classList.toggle('empty-box');
		}

		for(let i = 0; i < diceBoxes.length; i ++){
			if(!diceBoxes[i].classList.contains('clicked')){
				diceBoxes[i].addEventListener('click',function() {
					diceBoxes[i].classList.toggle('clicked');
				},false);
			}
		}
		pinned = false;

	}, false);

	function errorPopup(){
		errorScreen.classList.toggle('hidden');
		document.querySelector('#intro').classList.toggle('fade');
		document.querySelector('#game').classList.toggle('fade');
		document.querySelector('h1').classList.toggle('fade');
		document.querySelector('body').classList.toggle('gray');
		pinButton.disabled = false;
		startButton.disabled = false;
		rollButton.disabled = false;
	}

	rollButton.addEventListener('click', function() {
		console.log('roll button clicked');
		pinButton.disabled = false;
		rollButton.disabled = true;

		for(let i = 0; i < diceBoxes.length; i++){
			if(!diceBoxes[i].classList.contains('pinned')){
				diceBoxes[i].classList.toggle('empty-box');
				const firstElement = diceRolls.shift();
				diceBoxes[i].innerHTML = firstElement === 0 ? 3: firstElement; 
				diceBoxes[i].style.backgroundImage = "url('" + diceDictionary[parseInt(diceBoxes[i].innerHTML)-1] + "')";
				diceBoxes[i].classList.add('mouseOver');
			}
		}

	},false);

	pinButton.addEventListener('click', function() {
		console.log('pin button clicked');
		pinButton.disabled = false;
		for(let i = 0; i < diceBoxes.length; i++){
			if(diceBoxes[i].classList.contains('clicked')){
				pinned = true;
				diceBoxes[i].classList.remove('clicked');
				diceBoxes[i].classList.add('pinned');
				updateScore(diceBoxes[i].innerHTML);
				diceBoxes[i].classList.remove('mouseOver');
				diceBoxes[i].style.filter="invert(100%)";
				pinnedCount++;

			}
		}
		if(!pinned){
			errorPopup();
		}
		else if(pinnedCount === 5){
			rollButton.disabled = true;
			pinButton.disabled = true;
			restartButton.disabled = false;

			//win
			if(humanResult < computerResult){
				winner.classList.remove('hidden');
			}
			//tie
			else if(humanResult === computerResult){
				tie.classList.remove('hidden');
			}
			//lose
			else{
				loser.classList.remove('hidden');
			}

		}
		else{
			rollButton.disabled = false;
			pinButton.disabled = true;
			for(let i = 0; i < diceBoxes.length; i++){
				if(!diceBoxes[i].classList.contains('pinned')){
					diceBoxes[i].innerHTML = "";
					diceBoxes[i].classList.remove('mouseOver');
					diceBoxes[i].classList.toggle('empty-box');

				}
			}
		}

	},false);

	okGotItButton.addEventListener('click', function(){
		console.log('ok got it button clicked');
		errorPopup();
	},false);

	//EXTRA CREDIT: add restart button
	restartButton.addEventListener('click',function(){
		console.log('restart clicked');
		window.location.reload(true);
	},false);

}
	
document.addEventListener('DOMContentLoaded', main);