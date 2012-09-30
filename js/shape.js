/**
 * Shape is a base class for all shapes falling on the board:
 * Square, Line, Piramid, L1Shape, L2Shape, S1Shape, and S2Shape
 * The shape is constructed out of four blocks. Each block knows it's current
 * board location as (x,y).
 */
function Shape() {
    // This is an abstract class that will require the following variables to
    // be set in its child's constructor.
    this.board = new Board(1, 1);
    this.startingOrientation = undefined;
    this.variations = 0;
}

Shape.prototype.BLOCKS_PER_SHAPE = 4;
Shape.prototype.FALLING_PREFIX = "_";

/**
 * Represents one of the blocks that make up a shape
 * Each Block is defined by an x and a y value relative to the main game board
 * @param x
 * @param y
 */
Shape.prototype.Block = function (x, y) {
    this.x = x;
    this.y = y;
};

/**
 * If a starting position is not already assigned, generate a random one.
 * A valid position is a number between 0 and the number of variations to this
 * shape.
 */
Shape.prototype.setStartingOrientation = function() {
    this.orientation = (typeof this.startingOrientation !== 'undefined')
        ? this.startingOrientation : Math.floor(Math.random() * this.variations);
};

/**
 * Mark this shape as a falling shape
 * '_' indicates a falling shape.
 */
Shape.prototype.makeFalling = function() {
    this.shapeName = this.FALLING_PREFIX + this.shapeName;
};

/**
 * Hide the shape from the game by setting all coordinates of the shape on
 * the board to SKY
 */
Shape.prototype.hideShape = function() {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; i++) {
        // don't try to hide the blocks that just spawned above the game board.
        if (this.blocks[i].y < this.board.BOARD_HEIGHT) {
            this.board.space[this.blocks[i].x][this.blocks[i].y] = this.board.SKY;
        }
    }
};

/**
 * Show the shape to the game by setting all coordinates of the shape on
 * the board to the shape's name
 */
Shape.prototype.showShape = function() {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; i++) {
        // don't try to show the blocks that just spawned above the game board.
        if (this.blocks[i].y < this.board.BOARD_HEIGHT) {
            this.board.space[this.blocks[i].x][this.blocks[i].y] = this.shapeName;
        }
    }
};

/**
 * Check to see if this shape has anywhere to fall
 */
Shape.prototype.isLoweringNeeded = function() {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        // Lowering not needed if any block is at the bottom of the board
        // or if any block is not too high above the board
        // and the block below it is not a part of this shape
        // and the block below it is not sky
        if ((0 === this.blocks[i].y)
                || ((this.blocks[i].y < this.board.BOARD_HEIGHT)
                && (this.FALLING_PREFIX !== this.board.space[this.blocks[i].x][this.blocks[i].y - 1].charAt(0))
                && (this.board.SKY !== this.board.space[this.blocks[i].x][this.blocks[i].y - 1]))) {
            return false;
        }
    }
    return true;
};

/**
 * Drop the shape by one row: Reduce all of the y coordinates of the blocks by 1
 */
Shape.prototype.lower = function() {
    var i;
    this.hideShape();
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        this.blocks[i].y--;
    }
    this.showShape();
};

/**
 * Move the shape by one block to the right: Increase the x coordinates of each block by 1
 */
Shape.prototype.moveRight = function() {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        // Moving not allowed if any block is at the right edge of the board
        // or if any block is not too high above the board
        // and the block to the right is not part of this shape
        // and the block to the right is not sky
        if ((this.board.BOARD_WIDTH - 1 === this.blocks[i].x)
            || ((this.blocks[i].y < this.board.BOARD_HEIGHT)
            && (this.FALLING_PREFIX !== this.board.space[this.blocks[i].x + 1][this.blocks[i].y].charAt(0))
            && (this.board.SKY !== this.board.space[this.blocks[i].x + 1][this.blocks[i].y]))) {
            return;
        }
    }
    this.hideShape();
    // Move the shape
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        this.blocks[i].x++;
    }
    this.showShape();
};

/**
 * Move the shape by one block to the left: Decrease the x coordinates of each block by 1
 */
Shape.prototype.moveLeft = function () {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        // Moving not allowed if any block is at the left edge of the board
        // or if any block is not too high above the board
        // and the block to the left is not part of this shape
        // and the block to the left is not sky
        if ((0 === this.blocks[i].x)
            || ((this.blocks[i].y < this.board.BOARD_HEIGHT)
            && (this.FALLING_PREFIX !== this.board.space[this.blocks[i].x - 1][this.blocks[i].y].charAt(0))
            && (this.board.SKY !== this.board.space[this.blocks[i].x - 1][this.blocks[i].y]))) {
            return;
        }
    }
    this.hideShape();
    // Move the shape
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        this.blocks[i].x--;
    }
    this.showShape();
};

/**
 * Shape is illegal if any block of it is out of bounds,
 * or if any block that is not too high above the board is not covering SKY
 */
Shape.prototype.isLegalShape = function() {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        if (this.blocks[i].x < 0 || this.blocks[i].x > this.board.BOARD_WIDTH - 1
            || (this.blocks[i].y < this.board.BOARD_HEIGHT
            && this.board.SKY !== this.board.space[this.blocks[i].x][this.blocks[i].y])) {
            return false;
        }
    }
    return true;
};

/**
 * Determine if any part of this shape is still above the top of the board.
 * (Used to determine if the game is over)
 * @return true if any of the blocks that belong to this shape are not yet
 *      on the visible part of the board.
 */
Shape.prototype.isAboveBoard = function() {
    var i;
    for (i = 0; i < this.BLOCKS_PER_SHAPE; i++) {
        if (this.blocks[i].y >= this.board.BOARD_HEIGHT) {
            return true;
        }
    }
    return false;
};

/**
 * Prints the shape name and it's block's coordinates
 */
Shape.prototype.toString = function() {
    var i;
    var returnString = this.shapeName + " ";
    for (i = 0; i < this.BLOCKS_PER_SHAPE; ++i) {
        returnString += ("[" + this.blocks[i].x + "," + this.blocks[i].y + "]");
    }
    return returnString;
};

