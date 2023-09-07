const Maze = document.querySelector("#mazeBoard");
const planche = Maze.getContext("2d");
const generateBtn = document.querySelector("#generate")
const largeur = Maze.width;
const hauteur = Maze.height;
const mazeBackground = "black";
const cellLine = "antiquewhite";

const cellCountSelect = document.getElementById("cellCount");
let nb = 8 //parseInt(cellCountSelect.value);

const cellSize = hauteur / nb;

let cellZ = new Array(nb).fill(0).map(()=> new Array(nb).fill(0))

let running = false 

const scoreVal = document.querySelector("#scoreValue");
let score = 0

//const timerVal = document.querySelector("#timerValue")
//let startTime;

generateBtn.addEventListener("click", generateNew)


//cellCountSelect.addEventListener("change", function(){
//        nb = parseInt(cellCountSelect.value)
//        //cellZ = new Array(nb).fill(0).map(()=> new Array(nb).fill(0))
//        //console.log(`hello ${cellZ}`);
//        generateNew()
//});


class AlgoLab {
    constructor(mazeheight, mazewidth) {
        //this.random = new Random();
        this.mazeWidth = mazewidth;
        this.mazeHeight = mazeheight;
    }
    
    getNeighbour(cell, listMod) {
        let neighbours = [];
        if (cell.column > 0) {
            if (!listMod[cell.row][cell.column - 1].visited) {
                neighbours.push(listMod[cell.row][cell.column - 1]);
                
            }
        }
        if (cell.column < this.mazeWidth - 1) {
            if (!listMod[cell.row][cell.column + 1].visited) {
                neighbours.push(listMod[cell.row][cell.column + 1]);
            }
        }
        if (cell.row > 0) {
            if (!listMod[cell.row - 1][cell.column].visited) {
                neighbours.push(listMod[cell.row - 1][cell.column]);
            }
        }
        if (cell.row < this.mazeHeight - 1) {
            if (!listMod[cell.row + 1][cell.column].visited) {
                neighbours.push(listMod[cell.row + 1][cell.column]);
            }
        }

        if (neighbours.length > 0) {
            const index = Math.floor(Math.random()* neighbours.length)//this.random.nextInt(neighbours.length);
            return neighbours[index];
        }
        return null;
    }

    removeWall(cellCurrent, cellNext) {
        if (cellCurrent.row === cellNext.row + 1 && cellCurrent.column === cellNext.column) {
            cellCurrent.topWall = false;
            cellNext.bottomWall = false;
        }
        if (cellCurrent.row === cellNext.row - 1 && cellCurrent.column === cellNext.column) {
            cellCurrent.bottomWall = false;
            cellNext.topWall = false;
        }
        if (cellCurrent.row === cellNext.row && cellCurrent.column === cellNext.column - 1) {
            cellCurrent.rightWall = false;
            cellNext.leftWall = false;
        }
        if (cellCurrent.row === cellNext.row && cellCurrent.column === cellNext.column + 1) {
            cellCurrent.leftWall = false;
            cellNext.rightWall = false;
        }
    }

    createMaze(startY, startX, cellssss) {
        let stack = [];
        let current;
        let next;
        
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                cellssss[y][x] = new Cell(y, x);
            }
        }

        current = cellssss[startY][startX];
        current.visited = true;

        do {
            next = this.getNeighbour(current, cellssss);
            if (next != null) {
                this.removeWall(current, next);
                stack.push(current);
                current = next;
                current.visited = true;

                
            } else {
                current = stack.pop();
            }
        } while (stack.length > 0);

        cellssss[0].forEach((cell) =>{
            cell.topWall = false
        })

    }
}

class Labyrinthe extends AlgoLab{
    constructor(mazeHeight, mazeWidth, cells){
        super(mazeHeight, mazeWidth)
        this.listecells = cells;
    }

    generateMaze(starty, startx){
        console.log(starty);
        console.log(this.listecells);
        super.createMaze(starty, startx, this.listecells)
    }

    createNextMaze(exY, exX){
        const list2 = new Array(nb).fill(0).map(()=> new Array(nb).fill(0))
        //console.log(list2);
        super.createMaze(exY, exX, list2)
        //console.log(list2);
        list2[this.mazeHeight-1].forEach((cell) =>{
            cell.bottomWall = false ;
        })
        //console.log(list2);

        this.ajouterListe(this.listecells, list2);
        sortie.updateWalls(this.listecells[0][Math.floor(Math.random() * this.mazeWidth)]);
        joueur.updateWalls(this.listecells[this.mazeHeight-1][exX]);

        if (this.listecells.length >= 3 * this.mazeHeight) {
            this.enleverListe(this.listecells, this.mazeHeight);
        }
    }

    ajouterListe(x, y){
        for (let w = 0; w < x.length; w++) {
            for (let a = 0; a < x[0].length; a++) {
                x[w][a].row += this.mazeHeight;
            }
        }
        x.unshift(...y);
    };

    enleverListe(x, y){
        for(let i = 0; i < y; i++){
            x.pop()
        }
    };
}

class Cell{
    topWall = true ;
    bottomWall = true ;
    leftWall = true ;
    rightWall = true ;
    visited = false ;

    constructor(row, column) {
        this.row = row
        this.column = column
    }

    updateWalls(objet){
        this.bottomWall = objet.bottomWall;
        this.topWall = objet.topWall;
        this.rightWall = objet.rightWall;
        this.leftWall = objet.leftWall;
        this.row = objet.row;
        this.column = objet.column;
    }
    
    reset(a,b){
        this.row = a
        this.column = b
    }

}

class Player extends Cell{
    paint = "red"
    constructor(row, column){
        super(row, column)
        
    }

    draw() {
        planche.fillStyle = this.paint;
        planche.fillRect(this.column * cellSize +4, this.row * cellSize + 4, cellSize-8, cellSize-8);
    }

    movePlayer(deltaX, deltaY, cellss){
        if(this.column + deltaX >= 0 && this.column + deltaX < cellss[0].length){
            if(deltaX > 0 && !this.rightWall){
                this.updateWalls(cellss[this.row][this.column + deltaX])
            }
            if( deltaX < 0 && !this.leftWall){
                this.updateWalls(cellss[this.row][this.column + deltaX])
            }
        }

        if ( this.row + deltaY >= 0 && this.row + deltaY < cellss.length){
            if(deltaY > 0 && !this.bottomWall){
                this.updateWalls(cellss[this.row + deltaY][this.column])
            }
            if(deltaY < 0 && !this.topWall){
                this.updateWalls(cellss[this.row + deltaY][this.column] )
            }
        }
        this.draw();
    }
    
    effacerEmplacementPrecedent() {
        planche.fillStyle = mazeBackground; // Couleur d'arrière-plan
        planche.fillRect(this.column * cellSize +2, this.row * cellSize + 2, cellSize-5, cellSize-5);
    }
}

class Exit extends Cell{
    paint = "green"
    constructor(row, column){
        super(row, column)
    }

    draw(){
        planche.fillStyle = this.paint
        planche.fillRect(this.column *cellSize + 4, this.row*cellSize +4 , cellSize -7 , cellSize -7)
    }
}

class Snake {
    listPosition = [];
    snakeList = [];
    paint = "blue";
    isActive = false

    constructor(Speed, drawS) {
        this.speed = Speed;
        this.draws = drawS;
    }
    updateListPosition(playerPosition){
        if(this.checkInListPosition(playerPosition)){
            //console.log(this.listPosition);
            this.listPosition.push(new Cell(playerPosition.row, playerPosition.column));
            if(!this.isActive && this.listPosition.length>5){
                this.isActive = true
            }
        }
    }

    checkInListPosition(playerr){
        for(let i = 0; i < this.listPosition.length ; i++){
            let x = this.listPosition[i]
            if (x.row == playerr.row && x.column == playerr.column){
                return false
            }
        }
        return true
    }

    checkInSnakeList(playerrr){
        //console.log(playerrr);
        for (let i = 0; i < this.snakeList.length; i++) {
            const segment = this.snakeList[i];
            if (segment.row === playerrr.row && segment.column === playerrr.column) {
                return true; // Collision détectée
            }
        }
        return false; 
    }

    moveSnake(){
        this.effacerEmplacementPrecedent();
        if(this.snakeList.length < 5){
            this.snakeList.unshift(this.listPosition[0]);
            this.listPosition.shift();
        } else{
            this.snakeList.unshift(this.listPosition[0])
            this.snakeList.pop();
            this.listPosition.shift();
        }
        
        this.drawSnake();
        //console.log(this.snakeList);
        //console.log(joueur);
    }

    effacerEmplacementPrecedent() {
        this.snakeList.forEach(segment =>{
            //console.log(segment);
            planche.fillStyle = mazeBackground; // Couleur d'arrière-plan
            planche.fillRect(segment.column * cellSize +2, segment.row * cellSize + 2, cellSize-5, cellSize-5);
        })
        
    }

    drawSnake(){
        planche.fillStyle = this.paint;
        this.snakeList.forEach(x =>{
            planche.fillRect(x.column * cellSize +4, x.row * cellSize + 4, cellSize-8, cellSize-8);
        })
    }

    resetSnake(){
        this.listPosition = [];
        this.snakeList = [];
        this.isActive = false ;
    }

    changeLists(valeur){
        this.listPosition.forEach(x => {
            x.row += valeur
        })
        this.snakeList.forEach(x => {
            x.row += valeur
        })
    }

    changeSpeed(decreaseValue, whenValue){
        if(whenValue % 2 == 0 && this.speed >= 250){
            this.speed -= decreaseValue;
        }
    }
}

const joueur = new Player(nb-1, Math.floor(Math.random()*nb))
const sortie = new Exit(0, Math.floor(Math.random()*nb))
let qsdf = new Labyrinthe(nb, nb, cellZ)
let snakee = new Snake(500)

main();

function main(){
    scoreVal.textContent = score;
    initializeMaze();
    drawAll();   
    IDPlayerAndExit();
    //startTime = Date.now()
    nextTick();
    deplacerSerpent();
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            PlayerOnExit();
            //const currentTime = Date.now();
            //const elapsedTime = (currentTime - startTime) / 1000; // Temps écoulé en secondes
            //timerVal.textContent = "Temps : " + elapsedTime.toFixed(2) + " s";
            joueur.draw();
            sortie.draw();
            snakee.updateListPosition(joueur)
            //if(snakee.isActive){
            //    snakee.drawSnake();
            //}
            //snakee.drawSnake();
            eaten();
            nextTick();
        }, 75);
    }else{
        displayGameOver();
    }
};

function deplacerSerpent(){
    if(running){
        setTimeout(() => {
            if(snakee.isActive){
                snakee.moveSnake();
                //drawAll();
                //snakee.drawSnake();
                //console.log(snakee.snakeList);
                //console.log(snakee.listPosition);
                
            }
            //console.log(snakee.isActive);
            deplacerSerpent();
        }, snakee.speed);
    } else {
        displayGameOver();
    }
}

function eaten(){
    //console.log(`ListPosition length = ${snakee.listPosition}`);
    if(snakee.isActive && snakee.listPosition.length === 1 || snakee.checkInSnakeList(joueur)){
    //if(snakee.checkInListPosition(joueur)){
        snakee.isActive = false
        running = false
    }
}
function displayGameOver(){
    if(score == 0){
        planche.font = "70px MV Boli";
        planche.fillStyle = "white";
        planche.textAlign = "center";
        planche.fillText("Generate New!", largeur/2, hauteur/2);
    }else{
        planche.font = "70px MV Boli";
        planche.fillStyle = "white";
        planche.textAlign = "center";
        planche.fillText("GAME OVER!", largeur/2, hauteur/2);
        //running = false;
    }
    
};

function drawAll(){
    drawBackground();
    drawMaze();
}

function drawBackground(){
    planche.fillStyle = mazeBackground; 
    planche.fillRect(0,0, largeur, hauteur)
}

function initializeMaze(){
    //let qsdf = new Labyrinthe(nb, nb, cellZ)
    qsdf.generateMaze(nb-1, nb-1)
}

function PlayerOnExit(){
    if(joueur.row == sortie.row && joueur.column == sortie.column){
        score +=1;
        scoreVal.textContent = score;
        qsdf.createNextMaze(nb - 1, sortie.column)
        //running = false
        //window.removeEventListener("keydown", direction)
        snakee.changeLists(nb);
        snakee.changeSpeed(100, score);
        drawAll();
        joueur.draw();
        sortie.draw();
    }
}

function IDPlayerAndExit(){
    joueur.updateWalls(cellZ[joueur.row][joueur.column])
    joueur.draw();
    sortie.draw();
}

function direction(event){
    const keypressed = event.keyCode;
    const LEFT = 81;
    const RIGHT = 68;
    const DOWN = 83;
    const UP = 90;
    joueur.effacerEmplacementPrecedent()
    if(running){
        switch (true) {
            case (keypressed == LEFT):
                joueur.movePlayer(-1,0, cellZ)
                break;
            case (keypressed == RIGHT):
                joueur.movePlayer(1,0, cellZ)
                break;
            case (keypressed == UP):
                joueur.movePlayer(0, -1, cellZ)
                break;
            case (keypressed == DOWN):
                joueur.movePlayer(0, 1, cellZ)
                break ;
        }
        
    }
}
    
window.addEventListener("keydown", direction)

function dessinerMaze(x, y){
    if(cellZ[y][x].topWall){
        dessinerLigne(x * cellSize, (x+1)*cellSize, y * cellSize, y*cellSize)
    }
    if(cellZ[y][x].leftWall){
        dessinerLigne(x * cellSize, (x)*cellSize, y * cellSize, (y+1)*cellSize)
    }
    if(cellZ[y][x].bottomWall){
        dessinerLigne(x * cellSize, (x+1)*cellSize, (y+1) * cellSize, (y+1)*cellSize)
    }
    if(cellZ[y][x].rightWall){
        dessinerLigne((x+1) * cellSize, (x+1)*cellSize, y * cellSize, (y+1)*cellSize)
    }
      
}

function drawMaze(){
    for(let y = 0; y< cellZ.length; y++ ){
        for(let x = 0; x < cellZ[0].length; x++){
            dessinerMaze(x, y)
        }
    }
}

function dessinerLigne(xDebut, xFin, yDebut, yFin){
    planche.strokeStyle = cellLine; 
    planche.lineWidth = 3; 

    planche.beginPath();
    planche.moveTo(xDebut, yDebut); 
    planche.lineTo(xFin, yFin); 
    planche.stroke(); 
}

function generateNew(){
    score = 0;
    joueur.reset(nb-1, Math.floor(Math.random()*nb))
    sortie.reset(0, Math.floor(Math.random()*nb))
    running = true;
    snakee.resetSnake();
    main();
    window.addEventListener("keydown", direction);
};