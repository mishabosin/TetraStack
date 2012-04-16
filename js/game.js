/**
 * The Block Stacker game - not Tetris because that's a trademark ;)
 *
 * OVERVIEW:  Shapes consisting of 4 different blocks fall out of the sky.
 * The player's objective is to stack them as neatly as possible.
 * When a row is evenly filled with blocks all the way across the gameboard,
 * it vanishes, and all avbove blocks collapse to fill the space.
 *
 * CONTROLS:  User can use the arrow keys to move the block left or right.
 * The up key rotates the block, and the down key drops it to the bottom.
 * Spacebar pauses the game.
 *
 * SCORE: placing each block is worth a number of points based on the shape.
 * Clearing a row is worth extra points, and clearing multiple rows adds a
 * bonus.
 */
var game = (function() {
    var board = new Board(20, 10);
    var isGameStarted = false;
    var paused = true;
    var pauseDetected = true;
    var level = 1;
    var totalShapesDropped = 0;
    var score = 0;
    // Initialize the shapes
    var FallingShape = null;
    var previewShape = dropNewShape();
    // Set initial delay to 1/2 a second.
    var delay = 500;

    function init() {
        logger.log('Game initialized');

        document.getElementById("game").innerHTML = "Initializing...";
        document.getElementById("new-game-button").innerHTML = "Start";

        // Draw the game
        drawGame();
        drawPreview();
        addTouchScreenSupport();

        // Add the key listner:
        document.onkeydown = processKeys;

        /**
         * Check for the iPad/iPhone and add some buttons to push or listen for getures
         */
        function addTouchScreenSupport() {
            // TODO.
            // 1) validate this using the simulator
            // 2) use show/hide here instead of injecting a bunch of HTML?
            // 3) don't use a table - design a button layout.
            // 4) Detect swipe motions?
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
                document.getElementById("controls").innerHTML = "<table width='100%'><tr>\
                        <td><input id='left' type='button' onClick='game.userLeft();'></td>\
                        <td><input id='up' type='button' onClick='game.userUp();'></td>\
                        <td><input id='down' type='button' onClick='game.userDown();'></td>\
                        <td><input id='right' type='button' onClick='game.userRight();'></td>\
                        </tr></table>";
            }
        }
    }

    /**
     * Figure out what keys were pressed, and if is the arrow keys do the right
     * thing
     * @param key
     *      pressed key code
     */
    function processKeys(key) {
        var pressedKey = key.keyCode? key.keyCode : key.charCode;
        // TODO: make this work on IE
        // alert (pressedKey);
        if (32 === pressedKey) {
            togglePause();
        } else if (37 === pressedKey) {
            userLeft();
        } else if (39 === pressedKey) {
            userRight();
        } else if (38 === pressedKey) {
            userUp();
        } else if (40 === pressedKey) {
            userDown();
        }
    }

    function newGame() {
        logger.log('Staring a new game');
        if (isGameStarted) {
            togglePause();
            if (confirm("Are you sure you want to start a new game?")) {
                window.location.reload();
            } else {
                togglePause();
            }
        } else {
            startGame();
        }
        document.getElementById("new-game-button").blur();
    }

    /**
     * Initialize the Preview shape and the first Falling shape and start the
     * game.
     */
    function startGame() {
        FallingShape = previewShape;
        totalShapesDropped++;
        previewShape = dropNewShape();
        drawPreview();
        isGameStarted = true;
        togglePause();
        document.getElementById("new-game-button").innerHTML = "New Game";
    }

    /**
     * Randomly generate a new block of different type
     */
    function dropNewShape() {
        var NewShape;
        var numberOfPossibleShapes = 7;
        var draw = Math.floor(Math.random() * numberOfPossibleShapes);
        if (0 === draw) {
            NewShape = new Square(board, board.BOARD_WIDTH / 2 - 1, board.BOARD_HEIGHT);
        } else if (1 === draw) {
            NewShape = new Line(board, board.BOARD_WIDTH / 2 - 1, board.BOARD_HEIGHT, undefined);
        } else if (2 === draw) {
            NewShape = new Pyramid(board, board.BOARD_WIDTH / 2, board.BOARD_HEIGHT, undefined);
        } else if (3 === draw) {
            NewShape = new L1(board, board.BOARD_WIDTH / 2, board.BOARD_HEIGHT, undefined);
        } else if (4 === draw) {
            NewShape = new L2(board, board.BOARD_WIDTH / 2, board.BOARD_HEIGHT, undefined);
        } else if (5 === draw) {
            NewShape = new S1(board, board.BOARD_WIDTH / 2, board.BOARD_HEIGHT, undefined);
        } else if (6 === draw) {
            NewShape = new S2(board, board.BOARD_WIDTH / 2, board.BOARD_HEIGHT, undefined);
        }
        NewShape.makeFalling();
        //logger.log("Dropping " + NewShape.shapeName);
        return NewShape;
    }

    /**
     * Display the game grid
     */
    function drawGame() {
        var x, y;
        var gameTable = '<table class="game-board">';

        // The higher rows get added to the table first
        for (y = board.BOARD_HEIGHT - 1; y > -1; y--) {
            // Generate each row
            gameTable += '<tr>';
            for (x = 0; x < board.BOARD_WIDTH; x++) {
                gameTable += '<td class="' + board.space[x][y] + '">&nbsp;</td>';
            }
            gameTable += '</tr>';
        }
        gameTable += '</table>';
        document.getElementById("game").innerHTML = gameTable;
    }

    /**
     * The user wants to move the shape to the left.  Move the shape only if
     * it is allowed.
     */
    function userLeft() {
        if (!paused) {
            FallingShape.moveLeft();
            drawGame();
        }
    }

    /**
     * The user wants to move the shape to the right.  Move the shape only if
     * it is allowed.
     */
    function userRight() {
        if (!paused) {
            FallingShape.moveRight();
            drawGame();
        }
    }

    /**
     * The user wants to rotate the shape.  Rotate the shape only if it is
     * allowed.
     */
    function userUp() {
        var rotatedShape;
        if (!paused) {
            rotatedShape = FallingShape.rotate();
            //isLegalShape depends on the FallingShape to be hidden in order to be accurate
            FallingShape.hideShape();
            if (rotatedShape.isLegalShape()) {
                FallingShape = rotatedShape;
            }
            FallingShape.showShape();
            drawGame();
        }
    }

    /**
     * The user wants to drop the block to the very bottom.  Drop if allowed.
     */
    function userDown() {
        if (!paused) {
            while (FallingShape.isLoweringNeeded()) {
                FallingShape.lower();
                drawGame();
            }
        }
    }

    /**
     * Advance the game by dropping the shape downward, making sure all rules
     * are observed.
     * If the shape hits the bottom, leave it and check if rows can be removed.
     *
     * This method will keep recursively calling itself until the game-over
     * condition is met.
     */
    function advance() {
        // need this variable in case the pause is toggled multiple times
        // between calls to advance.
        pauseDetected = false;
        if (!paused) {
            if (FallingShape.isLoweringNeeded()) {
                FallingShape.lower();
                drawGame();
            } else {
                // block can't keep falling
                if (isGameOver()) {
                    recordPlayerScore();
                    return;
                } else {
                    // remove the _ prefix from the shape name to indicate it is no longer falling
                    FallingShape.shapeName = FallingShape.shapeName.substring(1);
                    FallingShape.showShape();
                    score += FallingShape.points * (level + 1);
                    manageRows(); // remove any full rows and fill the gap
                    updateUserProgress(); // update score, level, and delay
                    FallingShape = previewShape;
                    totalShapesDropped++;
                    previewShape = dropNewShape();
                    drawPreview();
                }
            }
            setTimeout(advance, delay);
        } else {
            pauseDetected = true;
        }
    }

    /**
     * Returns true if the game is over.
     * Game is over if at the and of an advance any part of the block is above
     * the top border of the game board
     */
    function isGameOver() {
        return FallingShape.isAboveBoard();
    }

    /**
     * Let the user know that the game is over, and pass their score on to
     * UpdateScore.php.
     */
    function recordPlayerScore() {
        //TODO: capture and store the score
        var playerName = prompt("GAME OVER\nFinal Score: " + score + "\nPlease enter your name:\n");
//        if (playerName && ("" !== playerName)) {
//            window.location="UpdateScores.php?needToAdd=1&score="+score+"&name="+playerName;
//        }
    }

    /**
     * Check to see if any rows can be removed and remove them if left with no
     * blocks on the board, give score bonus.
     */
    function manageRows() {
        var x, isBoardCleared;
        var boardClearedBonus = 600;
        if (clearRows()) {
            drawGame();
            dropRows();
            drawGame();
            isBoardCleared = true;
            for (x = 0; x < board.BOARD_WIDTH; ++x) {
                if (board.space[x][0] !== board.SKY) {
                    isBoardCleared = false;
                    break;
                }
            }
            if (isBoardCleared) {
                score += boardClearedBonus * level;
            }
        }
    }

    /**
     * Clear all rows that are full all the way across
     */
    function clearRows() {
        var rowsCleared = 0;
        var x, y, isFullRow;
        for (y = board.BOARD_HEIGHT - 1; y > -1; --y) {
            // Check each row for completeness
            isFullRow = true;
            for (x = 0; x < board.BOARD_WIDTH; ++x) {
                if (board.space[x][y] === board.SKY) {
                    isFullRow = false;
                    break;
                }
            }
            if (isFullRow) {
                for (x = 0; x < board.BOARD_WIDTH; ++x) {
                    board.space[x][y] = board.SKY;
                }
                rowsCleared++;
                // Calculate the score bonus for multiple rows clear
                // LVL1: 1 row = 40pts, 2 rows = 120pts, 3 rows = 280pts, 4rows = 600pts
                score += 10 * (Math.pow(2, rowsCleared + 1)) * level;
            }
        }
        return rowsCleared;
    }

    /**
     * Any row that has an entire row below it blank, should be dropped down
     * to the lowest blank row.
     */
    function dropRows() {
        var x, y;
        var bottomEmptyRow = null;
        for (y = 0; y < board.BOARD_HEIGHT; ++y) {
            if (isRowEmpty(y)) {
                // Only set the bottom row if it started out as null
                if (null === bottomEmptyRow) {
                    bottomEmptyRow = y;
                }
            } else if (bottomEmptyRow !== null) {
                // move the row down
                for (x = 0; x < board.BOARD_WIDTH; ++x) {
                    board.space[x][bottomEmptyRow] = board.space[x][y];
                    board.space[x][y] = board.SKY;
                }
                bottomEmptyRow += 1;
            }
        }
    }

    /**
     * Return true if every cell in this row is SKY
     * @param rowNumber
     *      row to test
     */
    function isRowEmpty(rowNumber) {
        var x;
        for (x = 0; x < board.BOARD_WIDTH; ++x) {
            if (board.space[x][rowNumber] !== board.SKY) {
                return false;
            }
        }
        return true;
    }

    /**
     * Recalculate the level and delay values, and update the Level and Score
     * areas of the game.
     */
    function updateUserProgress() {
        // Every 50 droppedShapes is around 20 cleared rows, level up first at
        // 35, but slightly increaase the number of shapes dropped every level.
        var baseNumOfShapes = 30;
        var shapesPerLevel = 5;
        var fraction = 8;
        var updateLevel = Math.ceil(totalShapesDropped / (baseNumOfShapes + shapesPerLevel * level));
        if (level < updateLevel) {
            level++;
            //
            // Level 1 = .5sec, Level 2 = .437sec, Level 3 = .382sec, ... Level 5 = .293sec ... Level 10 = .15sec
            delay = delay - delay / fraction;
            logger.log("Level:" + level + " Total shapes: " + totalShapesDropped + " Delay: " + delay + " sec.");
            // TODO: Pause the game and add some jquery fade-in for a custom alert?
            alert("Level " + level +"!");
        }
        // Update the scoreboard
        document.getElementById("score").innerHTML = "Score: " + score;
        document.getElementById("level").innerHTML = "Level: " + level;
    }

    /**
     * Display a 4x4 box to show the next shape
     * Define a blank preview board
     */
    function drawPreview() {
        var previewBoard = new Board(4, 5);
        var previewTable;
        var x, y, i, totalShapeBlocks;
        // Position on the preview board: this shape will always be above the
        // board and to the middle
        var xOffset = board.BOARD_WIDTH / 2 - 2;
        var yOffset = board.BOARD_HEIGHT;

        // Map the PreviewShape onto the board
        totalShapeBlocks = previewShape.BLOCKS_PER_SHAPE;
        for (i = 0; i < totalShapeBlocks; i++) {
            previewBoard.space[previewShape.blocks[i].x - xOffset][previewShape.blocks[i].y - yOffset] = previewShape.shapeName;
        }

        // Construct the html for the display table
        previewTable = '<div class="preview-header">Preview</div><table class="preview-board">';
        // The higher rows get added to the table first
        for (y = previewBoard.BOARD_HEIGHT - 1; y > -1; --y) {
            // Generate each row
            previewTable += '<tr>';
            for (x = 0; x < previewBoard.BOARD_WIDTH; ++x) {
                if (previewBoard.SKY === previewBoard.space[x][y]) {
                    previewTable += '<td>&nbsp;</td>';
                } else {
                    previewTable += '<td class="' + previewBoard.space[x][y] + '">&nbsp;</td>';
                }
            }
            previewTable += '</tr>';
        }
        previewTable += '</table>';

        document.getElementById("preview").innerHTML = previewTable;
    }

    /**
     * Display the game's empty grid: this is used to hide the blocks when paused
     */
    function drawPausedGame() {
        var x, y;
        var gameTable = '<table class="game-board">';
        var boardMiddle = board.BOARD_HEIGHT / 2;
        // The higher rows get added to the table first
        for (y = board.BOARD_HEIGHT - 1; y > -1; --y) {
            // Generate each row
            gameTable += '<tr>';
            for (x = 0; x < board.BOARD_WIDTH; ++x) {
                if (y === boardMiddle) {
                    if (2 === x) {
                        gameTable += '<td class="' + board.SKY + '">P</td>';
                    } else if (3 === x) {
                        gameTable += '<td class="' + board.SKY + '">A</td>';
                    } else if (4 === x) {
                        gameTable += '<td class="' + board.SKY + '">U</td>';
                    } else if (5 === x) {
                        gameTable += '<td class="' + board.SKY + '">S</td>';
                    } else if (6 === x) {
                        gameTable += '<td class="' + board.SKY + '">E</td>';
                    } else if (7 === x) {
                        gameTable += '<td class="' + board.SKY + '">D</td>';
                    } else {
                        gameTable += '<td class="' + board.SKY + '">&nbsp;</td>';
                    }
                } else {
                    gameTable += '<td class="' + board.SKY + '">&nbsp;</td>';
                }
            }
            gameTable += '</tr>';
        }
        gameTable += '</table>';

        document.getElementById("game").innerHTML = gameTable;
    }

    /**
     * Pause the game if the game is not paused, and unpause it if the game is
     * already paused.
     * Pausing the game means the blocks stop falling and can not be moved by
     * the player
     */
    function togglePause() {
        if (!isGameStarted) {
            // Start the game properly if it isn't already started
            startGame();
            // Need this seemingly redundant line to make isGameStarted work correctly
            isGameStarted = true;
            return;
        }
        if (paused) {
            paused = false;
            // Don't kick off another advance loop if the old one never noticed the pause.
            if (pauseDetected) {
                advance();
            }
        } else {
            paused = true;
            drawPausedGame();
        }
    }

    return {
        init: init,
        newGame: newGame,
        // Expose the game controls that can be bound to buttons on the screen.
        userLeft: userLeft,
        userRight: userRight,
        userUp: userUp,
        userDown: userDown
    };
})();
