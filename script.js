function gameGrid() {
    const grid = [];

    for (let i = 0; i < 3; i++) {
        grid[i] = [];
        for (let j = 0; j < 3; j++) {
            grid[i].push(cell());
        }
    }

    const getGrid = () => grid;

    const markMove = (row, column, token) => {
        
        if (grid[row][column].getToken() !== "_") {
            console.log("Wrong Move!!!");
            return false;
        }

        grid[row][column].addToken(token);
        return true;
    };

    const printGrid = () => {
        const markedGrid = grid.map((row) => row.map((cell) => cell.getToken()));
        console.log(markedGrid);
    };

    return { getGrid, markMove, printGrid };
}

function cell() {
    let token = "_";

    const addToken = (symbol) => {
        token = symbol;
    };

    const getToken = () => token;

    return { addToken, getToken };
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

    const prindNewGrid = () => {
        grid.printGrid();
        console.log(`${getActivePlayer().name}'s turn...`);
    }

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} marked ${row} row, ${column} column...`);
        let moved = grid.markMove(row, column, getActivePlayer().symbol);
        
        if (moved) {
            switchActivePlayer();
        }
        else {
            console.log(`Retry ${getActivePlayer().name}`);
        }

        prindNewGrid();
    };

    prindNewGrid();

    return { getActivePlayer, playRound };
}

const game = gameController();