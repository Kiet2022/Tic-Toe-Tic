// import { user, bot, cellsStatus } from './constants';
var isGameStart = false;
const user = {
    isTurn: true,
    sign: 'x'
};

const bot = {
    isTurn: false,
    sign: '0'
};

const cellsStatus = [
    {
        id: 'cell_0_0',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_0_1',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_0_2',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_1_0',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_1_1',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_1_2',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_2_0',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_2_1',
        isActive: true,
        sign: '',
        weight: 0
    },
    {
        id: 'cell_2_2',
        isActive: true,
        sign: '',
        weight: 0
    }

];

function startNewGame() {
    isGameStart = false;
    user.isTurn = true;
    bot.isTurn = false;
    user.sign = 'x';
    bot.sign = 'o'
    resetCellsStatus();

    document.getElementById('newGameButton').addEventListener('click', startNewGame)
    document.getElementById('xActiveSign').className = "activeSign active";
    document.getElementById('oActiveSign').className = "activeSign";
    document.getElementById('currentPlayerSign').innerText = user.sign.toUpperCase();
    document.getElementById('oScoreBoard').addEventListener('click', () => onHandleSelectOSign());
    drawPlayGround();
}

function drawPlayGround() {
    if (document.getElementById('playGround')) {
        document.getElementById("playGround").remove();
    }
    let playGround = document.createElement('div');
    playGround.id = 'playGround';

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        let row = document.createElement('div');
        row.id = `row_${rowIndex}`;
        row.className = 'row';
        for (let collumnIndex = 0; collumnIndex < 3; collumnIndex++) {
            let cell = document.createElement('button');
            cell.className = 'cell';
            cell.id = `cell_${rowIndex}_${collumnIndex}`;
            cell.disabled = false;
            cell.innerText = '';
            cell.addEventListener('click', () => onHandleUserClick(cell.id));

            row.appendChild(cell);
        }
        playGround.appendChild(row);
    }
    document.getElementById('body').appendChild(playGround)
}

function resetCellsStatus() {
    cellsStatus.forEach((cell) => {
        cell.isActive = true;
        cell.sign = '';
    })
}

function onHandleUserClick(cellId) {
    if (user.isTurn === true) {
        let cell = document.getElementById(cellId);
        if (!cell.disabled) {
            cell.innerText = user.sign;
            updateCellsStatus(cellId, user);
            cell.disabled = true;
        }

        isGameStart = true;
        isWin(user);
        changePlayer();
    }
}

function onHandleBotClick(cellId) {
    if (bot.isTurn === true) {
        let cell = document.getElementById(cellId);

        if (!cell.disabled) {
            cell.innerText = bot.sign;
            updateCellsStatus(cellId, bot);
            cell.disabled = true;
        }

        isGameStart = true;
        isWin(bot);
        changePlayer();
    }
}
function updateCellsStatus(cellId, player) {
    cellsStatus.forEach(cell => {
        if (cell.id === cellId) {
            cell.sign = player.sign;
            cell.isActive = false;
        }
    });
}

function runBot() {
    let options = cellsStatus.filter((c) => c.isActive === true);
    let opt = options[Math.floor(Math.random() * options.length)];
    opt.isActive = false;
    opt.sign = bot.sign;
    onHandleBotClick(opt.id);
}

function changePlayer() {
    let currentPlayerSign = document.getElementById('currentPlayerSign');
    if (user.isTurn) {
        currentPlayerSign.innerText = bot.sign.toUpperCase();
        user.isTurn = false;
        bot.isTurn = true;
        setTimeout(runBot, 750);
    } else if (bot.isTurn) {
        currentPlayerSign.innerText = user.sign.toUpperCase();
        user.isTurn = true;
        bot.isTurn = false;
    }

}

function onHandleSelectOSign() {
    if (!isGameStart) {
        document.getElementById('oActiveSign').className = "activeSign active";
        document.getElementById('xActiveSign').className = "activeSign";
        bot.sign = 'x';
        user.sign = 'o';
        user.isTurn = false;
        bot.isTurn = true;
        runBot();
    }
}

function isWin(player) {
    // alert('check: ' + player.sign)
    if (checkLineWin(player) || checkCrossWin(player)) {
        alert("winner " + player.sign)
        updateScoreBoard(player);
        endGame();
    }
}

function updateScoreBoard(player) {
    let updateBoardId = player.sign === 'x' ? 'xScore' : 'oScore';
    let score = document.getElementById(updateBoardId);
    score.innerText = Number(score.innerText) + 1;
}

function endGame() {
    bot.isTurn = false;
    user.isTurn = false;
    // alert('End')
}

function checkLineWin(player) {
    let sign = player.sign;
    
    for (let i = 0; i < 2; i++) {
         
        let isReverse = Boolean(i);
        let flag = true;
        for (let x = 0; x < 3; x++) {
            let order = ''
            if (getCell(x, 0, isReverse).innerText !== sign) {
                // alert(" player: " + player.sign +"pass "+ isReverse + " x:" + x )
                continue;
            }
            order += !isReverse? ` ${x}${0}` : ` ${0}${x}`
            for (let y = 1; y < 3; y++) {
                order += !isReverse? ` ${x}${y}` : ` ${y}${x}`
                let cell = getCell(x, y, isReverse)
                if (cell.innerText !== sign) {
                    // if(!isReverse){
                    //     alert('stop at: ' + x + " " + y)
                    // }else{
                    //     alert('stop at: ' + y + " " + x)
                    // }
                    
                    flag =false;
                    break;
                }
            }
            // alert("order: "+order)
            if(flag){
                return true;
            }
            
        }
    }
    return false;
}

function checkCrossWin(player) {
    let sign = player.sign;
    let cell = getCell(1, 1);

    if (cell.innerText !== sign) {
        return false;
    }

    if (getCell(0, 0).innerText === sign && getCell(2, 2).innerText === sign) {
        return true;
    } else if (getCell(0, 2).innerText === sign && getCell(2, 0).innerText === sign) {
        return true;
    }

    return false;
}

function getCell(x, y, isReverse) {
    if (isReverse) {
        return document.getElementById(`cell_${y}_${x}`);
    }
    return document.getElementById(`cell_${x}_${y}`);
}


startNewGame();


