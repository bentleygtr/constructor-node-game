//require inquirer
var inquirer = require('inquirer');
var isLetter = require('is-letter');
//require objects/exports
var Word = require('./word.js');
var Game = require('./game.js');




var theGame = {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,
  //empty array to hold letters guessed by user. 
  lettersGuessed: [],
  currWord: null,
  //asks user if they are ready to play
  startGame: function() {
    var that = this;
    //clears lettersGuessed before a new game starts 
    if(this.lettersGuessed.length > 0){
      this.lettersGuessed = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Ready to play?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("Fine, I didn't want to play anyway..");
      }
    })},
  //if they want to play starts new game.
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Okay! Here we go!");
      console.log('*****************');
      //generates random number based on the wordBank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currWord = new Word(this.wordBank[randNum]);
      this.currWord.getLets();
      //displays current word as blanks.
      console.log(this.currWord.makeWord());
      this.promptUser();
    } else{
      this.resetGuesses();
      this.newGame();
    }
  },
  resetGuesses: function() {
    this.resetGuesses = 10;
  },
  promptUser : function(){
    var that = this;
    //asks player for a letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      //toUpperCase because words in word bank are all caps
      var returnLetter = (ltr.chosenLtr).toUpperCase();
      //adds to the lettersGuessed array if it isn't already there
      var guessedAlready = false;
        for(var i = 0; i<that.lettersGuessed.length; i++){
          if(returnLetter === that.lettersGuessed[i]){
            guessedAlready = true;
          }
        }
        //if the letter wasn't guessed already run through entire function, else reprompt user
        if(guessedAlready === false){
          that.lettersGuessed.push(returnLetter);

          var found = that.currWord.checkIfLetterFound(returnLetter);
          //if none were found tell user they were wrong
          if(found === 0){
            console.log('Nope! You guessed wrong.');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);
            

            console.log('\n*******************');
            console.log(that.currWord.makeWord());
            console.log('\n*******************');

            console.log("Letters guessed: " + that.lettersGuessed);
          } else{
            console.log('Yes! You guessed right!');
              //checks to see if user won
              if(that.currWord.didWeFindTheWord() === true){
                console.log(that.currWord.makeWord());
                console.log('Congratulations! You won the game!!!');
                // that.startGame();
              } else{
                // display the user how many guesses remaining
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currWord.makeWord());
                console.log('\n*******************');
                console.log("Letters guessed: " + that.lettersGuessed);
              }
          }
          if(that.guessesRemaining > 0 && that.currWord.wordFound === false) {
            that.promptUser();
          }else if(that.guessesRemaining === 0){
            console.log('Game over!');
            console.log('The word you were guessing was: ' + that.currWord.word);
          }
        } else{
            console.log("You've guessed that letter already. Try again.")
            that.promptUser();
          }
    });
  }
}

theGame.startGame();
