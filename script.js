let blocksGrid = document.querySelectorAll("#board div")
let restartRound = document.querySelector("#restart")
let restartGame = document.querySelector("#restartGame")
let player1Score = document.querySelector("#player1Score")
let player2Score = document.querySelector("#player2Score")
let tieScore = document.querySelector("#tieScore")
restartGame

let controller = new AbortController();

newGame();
Round = new round();

restartRound.addEventListener('click',() => {
    restartround();
})

restartGame.addEventListener('click',() => {
    restartround();
    Round = new round();

    player1Score.textContent = 0
    player2Score.textContent = 0
    tieScore.textContent = 0
})

function restartround(){
    if (restartRound.textContent === "New Round"){
        restartRound.textContent = "Restart Round"
    }
    blocksGrid.forEach(blocks => {
        blocks.textContent = ""
    });
    newGame();
}

function newGame(){
    Grid = new game()

    blocksGrid.forEach(blocks => {
        blocks.addEventListener('click',(e)=>{
            let i = Array.from(e.target.parentElement.children).indexOf(e.target);
            displayBlock(e.target,Grid.returnGrid(i));
        },{'signal':controller.signal})
        Grid.setGrid();
    });
}

function displayBlock(block,objBlock){
    if (objBlock.getfill() == true){
        return;
    }
    if (Grid.getPlayer() == 1){
        block.textContent = "X";
        objBlock.setSymbol("X")
        Grid.changePlayer();
    }
    else{
        block.textContent = "O";
        objBlock.setSymbol("O")
        Grid.changePlayer();
    }
    objBlock.setfill()

    if (Grid.getturn() >= 4){
        checkWin();
    }
    Grid.addturn();
}

function block (Index){
    let fill = false;
    let symbol = "";
    this.index = Index;
    
    this.setfill = () => {
        fill = true;
    }
    this.getfill = () => {
        return fill;
    }
    this.setSymbol = (Symbol) => {
        symbol = Symbol;
    }
    this.getSymbol = () => {
        return symbol;
    }
}

function round(){
    let player1mark = 0;
    let player2mark = 0;
    let tiemark = 0;

    this.changePlayermark = (player) => {
        if (player === 0){
            player1mark = player1mark + 1;
        }
        else if(player === 1){
            player2mark = player2mark + 1;
        }
        else{
            tiemark = tiemark + 1;
        }
    }

    this.getMarks = (player) => {
        if (player === 0){
            return player1mark;
        }
        else if(player === 1){
            return player2mark;
        }
        else{
            return tiemark;
        }
    }
}

function game(){
    let num = 0;
    let turn = 0;
    let currentPlayer = 0;
    let Grid = []

    this.changePlayer = () => {
        if (currentPlayer == 1){
            currentPlayer = 0;
        }
        else{
            currentPlayer = 1
        }
    }

    this.setGrid = () => {
        Grid.push(new block(num))
        num++;
    }
    this.addturn = () => {
        turn = turn + 1;
    }
    this.getturn = () => {
        return turn;
    }
    this.returnGrid = (i) => {
        return Grid[i];
    }
    this.returnEntireGrid = () => {
        return Grid;
    }
    this.getPlayer = () => {
        return currentPlayer;
    }
}

function checkWin(){
    let checked = true;

    let firstrow = Grid.returnEntireGrid().slice(0,3)
    let secondtrow = Grid.returnEntireGrid().slice(3,6)
    let thirdtrow = Grid.returnEntireGrid().slice(6,9)
    let firstcol = Grid.returnEntireGrid().filter((block) => block.index % 3 === 0 ||  block.index === 0);
    let secondcol = Grid.returnEntireGrid().filter((block) => block.index % 3 ===  1 ||  block.index === 1);
    let thirdcol = Grid.returnEntireGrid().filter((block) => block.index % 3 === 2 ||  block.index === 2);
    let crossright = Grid.returnEntireGrid().filter((block) => block.index % 2 === 0 && (block.index !== 8 && block.index !== 0));
    let crossleft = Grid.returnEntireGrid().filter((block) => block.index % 2 === 0 && (block.index !== 2 && block.index !== 6) || block.index === 0);

    let checkerList = [firstrow,secondtrow,thirdtrow,firstcol,secondcol,thirdcol,crossright,crossleft]

    checkerList.forEach(list => {
        if ((list.every(block => block.getSymbol() === 'O'))){
            gameWon(0);
            checked = false;
            return;
        }
        else if((list.every(block => block.getSymbol() === 'X'))){
            gameWon(1);
            checked = false;
            return;
        } 
        else return;
     });

     if (Grid.getturn() === 8 && checked == true){
        gameWon(2)
        return;
    }
}

function gameWon(Player){
    if (Player === 0){
        console.log("Player one won")
        restartRound.textContent = "New Round"

        controller.abort();
        controller = new AbortController();

        Round.changePlayermark(0)
        player1Score.textContent = Round.getMarks(0)
    }

    else if(Player === 1){
        console.log("Player two won")
        restartRound.textContent = "New Round"

        controller.abort();
        controller = new AbortController();

        Round.changePlayermark(1)
        player2Score.textContent = Round.getMarks(1)
    }

    else{
        console.log("Tie")
        restartRound.textContent = "New Round"

        controller.abort();
        controller = new AbortController();

        Round.changePlayermark(2)
        tieScore.textContent = Round.getMarks(2)
    }
}
