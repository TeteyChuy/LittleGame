const canvas = document.querySelector('#game');
const gameArea = canvas.getContext ('2d');
const buttUp = document.querySelector('#up');
const buttDown = document.querySelector('#down');
const buttRight = document.querySelector('#right');
const buttLeft = document.querySelector('#left');
const showLives = document.querySelector('#lives');
const showtime = document.querySelector('#time');
const yesBtn = document.querySelector('#yesbtn');
const noBtn = document.querySelector('#nobtn');
const record_text=document.querySelector('#redord_text');
const win_text=document.querySelector('#win_text');
const restarMessage = document.querySelector('#text');
const record =document.querySelector('#record');
const startGameBTN = document.querySelector('#starGame');
let playersPosition = {x: -1, y: -1};
const giftPosition = {x: undefined, y: undefined};
let elementSize;
let canvasSize;
let enemiesPosition = [];
let level=0;
let selectedLifes=2;
let lives = selectedLifes; 
let emonjiCoalitio = [];
let startTime;
let timerReview;
let time;
let recordTime;


window.addEventListener('load', setSize);
window.addEventListener('resize', setSize);
window.addEventListener('keydown', kindOfKey);
buttUp.addEventListener('click', moveUp);
buttDown.addEventListener('click', moveDown);
buttRight.addEventListener('click', moveRight);
buttLeft.addEventListener('click', moveLeft);
yesBtn.addEventListener('click', resetGame);
noBtn.addEventListener('click', stopTime);
startGameBTN.addEventListener('click', startGame);
movePlayer()

function startGame (){
    startTime = 0;
    showTime();
    if (!startTime){
        startTime = Date.now();
        timerReview = setInterval(showTime,100);
    }
}

function setSize (){
    if(window.innerHeight > window.innerWidth){
        canvasSize= window.innerWidth * 0.9;
    }else{
        canvasSize= window.innerHeight * 0.9;
    }
canvas.setAttribute('width', canvasSize);
canvas.setAttribute('height', canvasSize);
elementSize=canvasSize/10;
initGame()
}

function movePlayer (){
    if (playersPosition.x == giftPosition.x && playersPosition.y == giftPosition.y){
        if(playersPosition.x != undefined && playersPosition.y != undefined){
        console.log('you have won');
        nextLevel ();
        }
    }
    const moveX=elementSize * (1+playersPosition.x);
    const moveY= elementSize * (1+playersPosition.y);
    const coalition = enemiesPosition.find(coal => {
       const coalX = coal.x == playersPosition.x; 
       const coalY = coal.y == playersPosition.y;
       return coalX && coalY;
    })
    if (coalition){
        console.log('you crash :(')
        fail (playersPosition.x, playersPosition.y)
        return
    }
        
    gameArea.fillText(emojis['PLAYER'], moveX + (elementSize * 0.1), moveY - (elementSize*.2));
}

function initGame (){
    showLive ();
    record.innerHTML = '00:00:00';

    gameArea.font = elementSize*.8  + 'px Verdana';
    gameArea.textAlign  = 'end';
    const map = maps[level];
        if (!map){
            stopTime ();
            finishGame()
            return
        }
    const mapRows = map.trim().split('\n');
    const mapCols = mapRows.map(rows => rows.trim().split(''))
    gameArea.clearRect(0,0, canvasSize, canvasSize);
    enemiesPosition = [];

    mapCols.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            let emoji = emojis[col];
            const xpos = elementSize * (1+colInd) + (elementSize * 0.1);     
            const ypos= elementSize * (1+rowInd) - (elementSize*.2);

            if (col == 'O'){
                if(playersPosition.x < 0 && playersPosition.y < 0){
                playersPosition.x= colInd;
                playersPosition.y= rowInd;
                }
            }
            else if (col == 'I') {
                giftPosition.x = colInd;
                giftPosition.y= rowInd;
            }
            else if (col == 'X'){
                enemiesPosition.push({x:colInd, y:rowInd})
            }
                    const coalition = emonjiCoalitio.find(coal => {
                        const coalX = coal.x == colInd; 
                        const coalY = coal.y == rowInd;
                        return coalX && coalY;
                        
                    })
                    if (coalition){
                        emoji=emojis['BOMB_COLLISION'];
                    }
            gameArea.fillText(emoji, xpos, ypos);   
        }); 

    }); 
    movePlayer();
}

//movement funtions
function kindOfKey (event){
    //console.log(event)
    if (event.key == 'ArrowUp' || event.key == 'w' || event.key == 'W') moveUp();
    else if (event.key == 'ArrowDown' || event.key == 's' || event.key == 'S') moveDown();
    else if (event.key == 'ArrowLeft' || event.key == 'a' || event.key == 'A') moveLeft();
    else if (event.key == 'ArrowRight' || event.key == 'd' || event.key == 'D') moveRight();
    else console.log('wrong Key');
}
function moveUp (){
    if ((playersPosition.y) < (1 )){
        console.log('Se acabó el mapa')
    }
    else {playersPosition.y -= 1;
        initGame();}
}
function moveDown(){
    // console.log(playersPosition.y)
    if ((playersPosition.y) >= (9 )){
        console.log('Se acabó el mapa')
    }
    else {playersPosition.y += 1;
        // console.log(playersPosition)
        initGame();}
}
function moveLeft(){
    // console.log(playersPosition.x)
    if ((playersPosition.x) <= (0 )){
        console.log('Se acabó el mapa')
    }
    else {playersPosition.x -= 1;
        // console.log(playersPosition)
        initGame();}
}
function moveRight (){
    // console.log(playersPosition.x)
    if ((playersPosition.x) >= (9)){
        console.log('Se acabó el mapa')
    }
    else {playersPosition.x += 1;
        // console.log(playersPosition)
        initGame();}
}
function nextLevel (){
    level = level + 1;
    emonjiCoalitio = [];
    restarlevel();
    initGame ();
}
function fail (poxX, poxY){
    emonjiCoalitio.push({x:poxX, y:poxY})
    lives --;
    if(lives == 0){
        restarMessage.innerHTML = 'You lose do you want to continue?'
        return
    }
    restarlevel();
    initGame ();
}
function restarlevel(){
    playersPosition.x = -1;
    playersPosition.y = -1;
}
function resetGame(){
    lives = selectedLifes;
    level = 0;
    emonjiCoalitio = [];
    restarMessage.innerHTML = '';
    startTime=0;
    restarlevel();
    initGame ();

}
function showLive (){
    showLives.innerHTML = emojis['HEART'].repeat(lives)
}
function showTime(){
    time = Date.now () - startTime;
    const playTime = convertTime(time);

    showtime.innerHTML = playTime;
}
function stopTime (){
    clearInterval(timerReview)
}
function finishGame (){
    win_text.innerHTML = 'You have won congratulations';
    let fixedTime;
    recordTime = localStorage.getItem('recordTime');
    const comparation = isNaN(recordTime);
        if(comparation){
            localStorage.clear('recordTime');
            console.log('ya se borró')
        }
        if(recordTime){
            if(recordTime >= time){
                localStorage.setItem('recordTime',time);
                fixedTime = convertTime(localStorage.getItem('recordTime'))
                record_text.innerHTML = `This is your new record ${fixedTime}`;
            }
            else{record_text.innerHTML = `You couldn't beat the record`;}

        }
        else {
            console.log('this is your firs record')
            localStorage.setItem('recordTime', time)
            fixedTime = convertTime(localStorage.getItem('recordTime', time));
            console.log(recordTime, fixedTime)
            record_text.innerHTML = `This is your first record ${fixedTime}`
            };
        console.log(fixedTime);
        record.innerHTML = convertTime(recordTime);
}
function convertTime (time){
    const mseg = Math.floor(time/10)% 100;
    const seg = Math.floor(time / 1000) % 60;
    const min = Math.floor(seg/60); 
    const msegS = `0${mseg}`.slice(-2);
    const minS = `0${min}`.slice(-2);
    const segS = `0${seg}`.slice(-2);
    return minS +  ':' + segS + ':' + msegS
}