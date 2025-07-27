function gameGrid() {
    const grid = [];

    for (let i = 0; i < 3; i++) {
        grid[i] = [];
        for (let j = 0; j < 3; j++) {
            grid[i].push(cell());
        }
    }

    const getGrid = () => grid;

    const markMove = (row, column, token, move) => {
        
        if (grid[row][column].getToken() !== " ") {
            // console.log("Wrong Move!!!");
            return move;
        }

        grid[row][column].addToken(token);
        return move+1;
    };

    // const printGrid = () => {
    //     const markedGrid = grid.map((row) => row.map((cell) => cell.getToken()));
    //     console.log(markedGrid);
    // };

    return { getGrid, markMove,  };  // printGrid added for console.
}

function cell() {
    let token = " ";

    const addToken = (symbol) => {
        token = symbol;
    };

    const getToken = () => token;

    return { addToken, getToken };
}

function checkWin(token, grid) {
    return ((grid[0][0].getToken()==token && grid[0][1].getToken()==token && grid[0][2].getToken()==token) ||
            (grid[1][0].getToken()==token && grid[1][1].getToken()==token && grid[1][2].getToken()==token) ||    
            (grid[2][0].getToken()==token && grid[2][1].getToken()==token && grid[2][2].getToken()==token) ||   
            (grid[0][0].getToken()==token && grid[1][0].getToken()==token && grid[2][0].getToken()==token) ||   
            (grid[0][1].getToken()==token && grid[1][1].getToken()==token && grid[2][1].getToken()==token) ||   
            (grid[0][2].getToken()==token && grid[1][2].getToken()==token && grid[2][2].getToken()==token) ||   
            (grid[0][0].getToken()==token && grid[1][1].getToken()==token && grid[2][2].getToken()==token) ||    
            (grid[0][2].getToken()==token && grid[1][1].getToken()==token && grid[2][0].getToken()==token));   
}

function gameController(
    playerOneName = "Vivek",
    playerTwoName = "Basu"
) {
    const grid = gameGrid();

    const players = [
        {
            name : playerOneName,
            symbol : 'X'
        },
        {
            name : playerTwoName,
            symbol : 'O'
        }
    ]

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = (activePlayer == players[0])?players[1] :players[0];
    };

    const getActivePlayer = () => activePlayer;

    // const prindNewGrid = () => {
    //     grid.printGrid();
    //     console.log(`${getActivePlayer().name}'s turn...`);
    // }

    let move = 0;

    const getMove = () => move;

    const playRound = (selectedCell, stateOfGame) => {
        if (!stateOfGame)
            return "";

        // console.log(`${getActivePlayer().name} marked ${row} row, ${column} column...`);
        let updatedMove = grid.markMove(selectedCell[0], selectedCell[1], getActivePlayer().symbol, getMove());

        if (updatedMove >= 5 && checkWin(getActivePlayer().symbol, grid.getGrid())){
            // console.log(`${getActivePlayer().name} is the Winner!!!`);
            // grid.printGrid();
            move = updatedMove;
            return "win";
        }
        else if (updatedMove == 9) {
            // console.log("Tie!");
            move = updatedMove;
            return "tie";
        }
        else if (updatedMove > getMove()) {
            switchActivePlayer();
            move = updatedMove;
            return "continue";
        }
        else {
            // console.log(`Retry ${getActivePlayer().name}`);
            return "retry";
        }

        // prindNewGrid();
    };

    // prindNewGrid();

    return { getActivePlayer, playRound, getGrid : grid.getGrid() };
}

function screenController (firstName, secondName) {
    const game  = gameController(firstName, secondName);
    const playerTurnDiv = document.querySelector(".turn");
    const gridDiv = document.querySelector(".grid");
    const grid = game.getGrid;
    
    const setGrid = () => {
        gridDiv.innerHTML = "";
        const activePlayer = game.getActivePlayer();
        
        playerTurnDiv.innerHTML = `${activePlayer.name}'s turn...`;
        
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                
                cellButton.innerHTML = cell.getToken();
                gridDiv.appendChild(cellButton);
            });
        });
    }

    let stateOfGame = true;

    const updateScreen = (action, e, selectedCell) => {
        const activePlayer = game.getActivePlayer();
        console.log(action);

        playerTurnDiv.innerHTML = ((action == "continue")?`${activePlayer.name}'s turn...` : ((action == "win") ? `${activePlayer.name} is the Winner!!!`: ((action == "tie") ? "The match is a Tie." : `Retry ${activePlayer.name}`)));

        e.target.innerHTML = grid[selectedCell[0]][selectedCell[1]].getToken();

        if (action == "win" || action == "tie") {
            stateOfGame = false;
            const restartBtn = document.querySelector(".restart")
            setTimeout(() => {
                playerTurnDiv.classList.toggle("inactive");
                restartBtn.classList.toggle("inactive");
            }, 3000);
        }
    };

    function clickHandlerGrid(e) {
        const selectedCell = [e.target.dataset.row, e.target.dataset.column];

        if (selectedCell.length == 0) return;

        const action = game.playRound(selectedCell, stateOfGame);

        if (action == "")
            return;
        updateScreen(action, e, selectedCell);
    }

    gridDiv.addEventListener("click", clickHandlerGrid);

    setGrid();
}

function landingPage() {
    const firstName = document.querySelector("#firstName");
    const secondName = document.querySelector("#secondName");
    const landingPage = document.querySelector(".landingPage");
    const container = document.querySelector(".container");
    const start = document.querySelector(".start");
    const restart = document.querySelector(".restart");

    const startMatch = () => {
        if (firstName.checkValidity() && secondName.checkValidity()) {
            landingPage.classList.toggle("inactive");
            container.classList.toggle("inactive");

            screenController(firstName.value, secondName.value);
        }
        else {
            alert("Fill both Names.")
        };
    };

    const startAgain = () => {
        firstName.value = '';
        secondName.value = '';
        const playerTurnDiv = document.querySelector(".turn");
        landingPage.classList.toggle("inactive");
        container.classList.toggle("inactive");
        restart.classList.toggle("inactive");
        playerTurnDiv.classList.toggle("inactive");
    };

    start.addEventListener("click" , startMatch);
    restart.addEventListener("click", startAgain);
}

landingPage();