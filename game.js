/*global variables*/
class Player{
  
   #globalScore=0;
   #currentScore=0;

   constructor(name){
    this.PlayerName=name;
   }

   get getGlobalScore(){
    return this.#globalScore;
   }
   get getCurrentScore(){
    return this.#currentScore
   }
   
   set setGlobalScore(score){
    this.#globalScore=score;

   }
   set setCurrentScore(score){
    this.#currentScore=score;
   }

    reset(params) {
        this.#globalScore=0;
        this.#currentScore=0;
   }
}



class PigGame{
    #turn=0;//making turn private so that turn can't be change from outside
    #currentPlayer=players[this.#turn];//making private so that not be manipulated from outside
    maxScore=100;

    
    newGame(){
        p1.reset();
        p2.reset();
    }
    diceRoll(){
    //check game is over or not before rolling the dice
    //and prevent rolling the dice if game is over
    if(this.isGameOver())
        return false;
    
        //roll the dice and update score
        const randomDigit= Math.floor (Math.random() * (6 - 1 +1 )) + 1;
        if(randomDigit===1){
          this.updateCurrentScore(0);
          this.updateGlobalScore(true);
        }
        else
          this.updateCurrentScore(randomDigit);

    return randomDigit;
    }

    updateCurrentScore(randomDigit){
        let nextScore;
        if(randomDigit===0)
        nextScore=0; //if dice rolled to one than reset the current score to zero
        else
        nextScore=this.#currentPlayer.getCurrentScore+randomDigit;
        this.#currentPlayer.setCurrentScore=nextScore;
        // if(nextScore>=100){
        // this.gameOver=true;
        // updateGlobalScore();
        // }
    }
    updateGlobalScore(isDiceRolledToOne=false){
        //update globalScore on hold or when dice rolled to 1
        let nextScore;
        if(isDiceRolledToOne)
        nextScore=0;
        else
        nextScore=this.#currentPlayer.getGlobalScore + this.#currentPlayer.getCurrentScore;

        this.#currentPlayer.setGlobalScore=nextScore;
        return  nextScore;

    }
    hold(){

       let globalScoreAfterHold= this.updateGlobalScore();

        //reset the currentScore of player to zero after hold
        this.#currentPlayer.setCurrentScore=0;

        //change the turn
        (this.#turn)?this.#turn=0:this.#turn=1;
        this.#currentPlayer=players[this.#turn];

        return globalScoreAfterHold;


    }

    isGameOver(){
     let secondPlayer= players[Math.abs(this.#turn -1)];
      if(
        this.#currentPlayer.getGlobalScore>=this.maxScore 
     ||  secondPlayer.getGlobalScore>= this.maxScore
     )
        return true;
     else
        return false;

    }
    whoWin(){
    if( p1.getGlobalScore > p2.getGlobalScore)
           return p1;
    else if( p1.getGlobalScore < p2.getGlobalScore);
           return p2;
    }

    get getTurn(){
        return this.#turn;
    }
    get getCurrentPlayer(){
        return this.#currentPlayer;
    }

}




class UserInterface{
    //control btns
    constructor(){
     this._("#p1Name").textContent=p1.PlayerName.toUpperCase();
     this._("#p2Name").textContent=p2.PlayerName.toUpperCase();
     this.displayWhoseTurnMsg();
    }
    newGameBtn=this._("#newGameBtn");
    rollDiceBtn=this._("#roll_dice");
    holdBtn=this._("#hold");

    //currentScore wrapper ***Note-> changing this key name need cascading  among other part of project*/
    p0CurrentScore=this._("#p1_current_score");
 
    p1CurrentScore=this._("#p2_current_score");

    //Global score wrapper ***Note-> changing this key name need cascading  among other part of project*/
    p0GlobalScore=this._("#p1_global_score");
    p1GlobalScore=this._("#p2_global_score");


    //img element
    imgEle=this._("#dice");
  
    _(element){
        return document.querySelector(element);
    }

    //show the global score

    showGlobalScore(score,isGameHold=false){
        let turn;
        isGameHold?turn=Math.abs(game.getTurn -1):turn=game.getTurn;/*selecting the prev user  when game is hold otherwise selecting the current user*/
        this[`p${turn}GlobalScore`].textContent=score;
    }

    showCurrentScore(score){
        this[`p${game.getTurn}CurrentScore`].textContent=score;
    }

    changeDiceImage(outcome){
     this.imgEle.src=`image/dice${outcome}.png`;
    }

    changeActiveSide(){
       let prevTurn=Math.abs(game.getTurn -1);
       this._(`.player_side_${prevTurn}`).classList.remove('active_side');
       this._(`.player_side_${game.getTurn}`).classList.add('active_side');
    }

    resetUserInterface(){
        this.imgEle.src='image/dice1.png';

        this['p0CurrentScore'].textContent=0;
        this['p1CurrentScore'].textContent=0;

        this['p0GlobalScore'].textContent=0;
        this['p1GlobalScore'].textContent=0;
        this.displayWhoseTurnMsg()

    }
    displayWhoseTurnMsg(){
        alert("it's "+players[game.getTurn].PlayerName+" turn");
    }

}

//Driver_code

const p1=new Player(window.prompt("Enter Player1 Name")??"player1");//creating player1
const p2=new Player(window.prompt("Enter Player2 Name")??"player2");//creating player2
const players=[p1,p2];

//creating a new game obj
const game= new PigGame();

//creating User_interface object
const ui=new UserInterface();

ui.rollDiceBtn.addEventListener("click",rollingDiceHandler);
ui.holdBtn.addEventListener("click",holdHandler);
ui.newGameBtn.addEventListener("click",newGameHandler);

function rollingDiceHandler(){
   //let's roll the dice...
   let outcome= game.diceRoll();
   console.log(outcome);

   //if game over
   if(!outcome){
    //check who win 
    alert(game.whoWin().PlayerName + 'win the game')

    game.newGame();
    ui.resetUserInterface();
    return;
   }

   if(outcome===1){
    //show the global score as zero
    ui.showGlobalScore(0);
    //show the current score as zero
    ui.showCurrentScore(0);
   }
   else{
    //show the current score 
    ui.showCurrentScore(game.getCurrentPlayer.getCurrentScore);
   }
    ui.changeDiceImage(outcome)
     //show outcome of dice to the user

}

function holdHandler(){
    ui.showGlobalScore(game.hold(),true);
    ui.changeActiveSide()
}

function newGameHandler(){
    //starting new game
  if(confirm("Are you sure ,want to restart the game ?")){

    game.newGame();
    ui.resetUserInterface();
  }

    //clearing the previous score
}

//Attaching event listeners