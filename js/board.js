/**
 * Game board is a rectangle filled with even squares.  These squares will
 * be filled with falling shapes.
 */
function Board(height, width) {
    var boardScope = this;
    // Sky is the deafault space that does not contain a shape.
    boardScope.SKY = "SKY";
    boardScope.BOARD_WIDTH = width;
    boardScope.BOARD_HEIGHT = height;
    boardScope.space = new Array(boardScope.BOARD_WIDTH);

    // Init the board right away.
    init();

    /**
     * Fill the board space with sky: init every square
     */
    function init() {
        var x, y;
        for (x = 0; x < boardScope.BOARD_WIDTH; x++) {
            boardScope.space[x] = new Array(boardScope.BOARD_HEIGHT);
            for (y = 0; y < boardScope.BOARD_HEIGHT; y++) {
                boardScope.space[x][y] = boardScope.SKY;
            }
        }
    }
}
