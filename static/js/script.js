let game = {
    'player': {'scoreSpan': '#player-result', 'div': '#player-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'draws': 0,
    'losses': 0,
    'isStand': false, // turns true once you press stand so you can no longer press hit
    'turnsOver': false, //turns true after the dealer has played so you can't press deal while playing
};
const PLAYER = game['player'];
const DEALER = game['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#hit-button').addEventListener('click', hit);
document.querySelector('#deal-button').addEventListener('click', deal);
document.querySelector('#stand-button').addEventListener('click', dealerLogic);

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage); //adds card to box
        hitSound.play();
    }    
}
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13); //random index from 0 - 12
    return game['cards'][randomIndex]; //returns a random item of cards list
}
function updateScore(card, activePlayer) {
    //Ace's value will be 11 if the player will not go bust, otherwise it is 1.
    if (card ==='A'){
        if (activePlayer['score'] + game['cardsMap'][card][1] <= 21){
            activePlayer['score'] += game['cardsMap'][card][1]; //adds 11
        } else {
            activePlayer['score'] += game['cardsMap'][card][0]; //adds 1
        }
    } else {
        activePlayer['score'] += game['cardsMap'][card] //updates the score with the latest card's value
    } 
}
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }    
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function dealerLogic() {
    while (DEALER['score'] < 16) {
        game['isStand'] = true;
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER); 
        await sleep(1000);
    }
    game['turnsOver'] = true;
    let winner = calculateWinner(); 
    showResult(winner);
}
function hit() {
    if (game['isStand'] === false) {
        let card = randomCard();
        showCard(card, PLAYER);
        updateScore(card, PLAYER);
        showScore(PLAYER);
    }    
}
function deal() {
    if (game['turnsOver'] === true) {
        let playerImages = document.querySelector('#player-box').querySelectorAll('img'); //returns list of all images in box
        for (i=0; i < playerImages.length; i++) {
            playerImages[i].remove();
        } 
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img'); //returns list of all images in box
        for (i=0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        PLAYER['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector(PLAYER['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector(PLAYER['scoreSpan']).style.color = '#ffffff';
        document.querySelector(DEALER['scoreSpan']).style.color = '#ffffff';
        document.querySelector('#game-result').textContent = 'Let\'s play';
        document.querySelector('#game-result').style.color = 'black';

        game['isStand'] = false;
        game['turnsOver'] = true;
    }
}
//return winner and update wins, draws and losses
function calculateWinner() {
    let winner;
    if (PLAYER['score'] <= 21) {
        if (PLAYER['score'] > DEALER['score'] || DEALER['score'] > 21) {
           //The human won 
           game['wins']++;
           winner = PLAYER;
        } else if (PLAYER['score'] < DEALER['score']) {
            //The computer won
            game['losses']++;
            winner = DEALER;
        } else if (PLAYER['score'] === DEALER['score']) {
            //Both players drew
            game['draws']++;
        }
    } else if (PLAYER['score'] > 21 && DEALER['score'] <= 21) {
        game['losses']++;
        winner = DEALER;
    }
    else if (PLAYER['score'] > 21 && DEALER['score'] > 21) {
        //Both players drew
        game['draws']++;
    }
    return winner;
}
function showResult(winner) {
    let message, messageColour;
    if (game['turnsOver'] === true) {
        if (winner === PLAYER) {
            document.querySelector('#wins').textContent = game['wins'];
            message = 'You won!';
            messageColour = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = game['losses'];
            message = 'You lost!';
            messageColour = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = game['draws'];
            message = 'You drew!';
            messageColour = 'black';
        }
        document.querySelector('#game-result').textContent = message;
        document.querySelector('#game-result').style.color = messageColour;
    }
}
