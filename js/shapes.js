
/**
 * |-----------------|
 * | block2 | block3 |
 * |-----------------|
 * | block0 | block1 |
 * |-----------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 */
function Square (board, keystoneX, keystoneY) {
    this.board = board;
    this.points = 2;

    // Initialize the shape above the top border of the screen.
    this.blocks = new Array(this.BLOCKS_PER_SHAPE);
    this.blocks[0] = new this.Block(keystoneX, keystoneY);
    this.blocks[1] = new this.Block(keystoneX + 1, keystoneY);
    this.blocks[2] = new this.Block(keystoneX, keystoneY + 1);
    this.blocks[3] = new this.Block(keystoneX + 1, keystoneY + 1);
}
// Inherit from Shape
Square.prototype = new Shape();
Square.prototype.shapeName = 'SQUARE';
/**
 * Squares don't really rotate.
 */
Square.prototype.rotate = function (){
    return this;
};



/**
 * |-----------------------------------|
 * | block0 | block1 | block2 | block3 |
 * |-----------------------------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 * @param startingOrientation
 *      orientation of the shape
 */
function Line (board, keystoneX, keystoneY, startingOrientation) {
    var lineScope = this;
    lineScope.board = board;
    lineScope.points = 1;
    lineScope.variations = 2;
    lineScope.startingOrientation = startingOrientation;
    lineScope.setStartingOrientation();

    // initialize the blocks
    lineScope.blocks = new Array(this.BLOCKS_PER_SHAPE);
    if (0 === lineScope.orientation) {
        // horizontal line
        lineScope.blocks[0] = new lineScope.Block(keystoneX - 1, keystoneY);
        lineScope.blocks[1] = new lineScope.Block(keystoneX, keystoneY);
        lineScope.blocks[2] = new lineScope.Block(keystoneX + 1, keystoneY);
        lineScope.blocks[3] = new lineScope.Block(keystoneX + 2, keystoneY);
    } else {
        // vertical line
        lineScope.blocks[0] = new lineScope.Block(keystoneX, keystoneY);
        lineScope.blocks[1] = new lineScope.Block(keystoneX, keystoneY + 1);
        lineScope.blocks[2] = new lineScope.Block(keystoneX, keystoneY + 2);
        lineScope.blocks[3] = new lineScope.Block(keystoneX, keystoneY + 3);
    }
}
// Inherit from Shape
Line.prototype = new Shape();
Line.prototype.shapeName = 'LINE';
/**
 * Return a shape that is the rotated version of this shape.
 */
Line.prototype.rotate = function() {
    var Rotated;
    if (0 === this.orientation) {
        Rotated = new Line(this.board, this.blocks[1].x, this.blocks[1].y, 1);
    } else {
        Rotated = new Line(this.board, this.blocks[0].x, this.blocks[0].y, 0);
    }
    Rotated.makeFalling();
    return Rotated;
};



/**
 * |--------------------------|
 * |        | block3 |        |
 * |--------------------------|
 * | block0 | block1 | block2 |
 * |--------------------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 * @param startingOrientation
 *      orientation of the shape
 */
function Pyramid (board, keystoneX, keystoneY, startingOrientation) {
    var pyramidScope = this;
    pyramidScope.board = board;
    pyramidScope.points = 2;
    pyramidScope.variations = 4;
    pyramidScope.startingOrientation = startingOrientation;
    pyramidScope.setStartingOrientation();

    // Initialize the blocks
    pyramidScope.blocks = new Array(this.BLOCKS_PER_SHAPE);
    if (0 === pyramidScope.orientation) {
        // pointing up
        pyramidScope.blocks[0] = new pyramidScope.Block(keystoneX - 1, keystoneY);
        pyramidScope.blocks[1] = new pyramidScope.Block(keystoneX, keystoneY);
        pyramidScope.blocks[2] = new pyramidScope.Block(keystoneX + 1, keystoneY);
        pyramidScope.blocks[3] = new pyramidScope.Block(keystoneX, keystoneY + 1);
    } else if (1 === pyramidScope.orientation) {
        // pointing right
        pyramidScope.blocks[0] = new pyramidScope.Block(keystoneX, keystoneY + 2);
        pyramidScope.blocks[1] = new pyramidScope.Block(keystoneX, keystoneY + 1);
        pyramidScope.blocks[2] = new pyramidScope.Block(keystoneX, keystoneY);
        pyramidScope.blocks[3] = new pyramidScope.Block(keystoneX + 1, keystoneY + 1);
    } else if (2 === pyramidScope.orientation) {
        // pointing down
        pyramidScope.blocks[0] = new pyramidScope.Block(keystoneX + 1, keystoneY + 1);
        pyramidScope.blocks[1] = new pyramidScope.Block(keystoneX, keystoneY + 1);
        pyramidScope.blocks[2] = new pyramidScope.Block(keystoneX - 1, keystoneY + 1);
        pyramidScope.blocks[3] = new pyramidScope.Block(keystoneX, keystoneY);
    } else {
        // pointing left
        pyramidScope.blocks[0] = new pyramidScope.Block(keystoneX, keystoneY);
        pyramidScope.blocks[1] = new pyramidScope.Block(keystoneX, keystoneY + 1);
        pyramidScope.blocks[2] = new pyramidScope.Block(keystoneX, keystoneY + 2);
        pyramidScope.blocks[3] = new pyramidScope.Block(keystoneX - 1, keystoneY + 1);
    }
}
// Inherit from Shape
Pyramid.prototype = new Shape();
Pyramid.prototype.shapeName = 'PYRAMID';
/**
 * Return a shape that is the rotated version of this shape.
 */
Pyramid.prototype.rotate = function() {
    var Rotated;
    if (0 === this.orientation) {
        Rotated = new Pyramid(this.board, this.blocks[1].x, this.blocks[1].y, 1);
    } else if (1 === this.orientation) {
        Rotated = new Pyramid(this.board, this.blocks[2].x, this.blocks[2].y, 2);
    } else if (2 === this.orientation) {
        Rotated = new Pyramid(this.board, this.blocks[3].x, this.blocks[3].y, 3);
    } else {
        Rotated = new Pyramid(this.board, this.blocks[0].x, this.blocks[0].y, 0);
    }
    Rotated.makeFalling();
    return Rotated;
};



/**
 * |--------------------------|
 * |        |        | block3 |
 * |--------------------------|
 * | block0 | block1 | block2 |
 * |--------------------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 * @param startingOrientation
 *      orientation of the shape
 */
function L1 (board, keystoneX, keystoneY, startingOrientation) {
    var l1Scope = this;
    l1Scope.board = board;
    l1Scope.points = 3;
    l1Scope.variations = 4;
    l1Scope.startingOrientation = startingOrientation;
    l1Scope.setStartingOrientation();

    // Initialize the blocks
    l1Scope.blocks = new Array(this.BLOCKS_PER_SHAPE);
    if (0 === l1Scope.orientation) {
        // pointing up
        l1Scope.blocks[0] = new l1Scope.Block(keystoneX - 1, keystoneY);
        l1Scope.blocks[1] = new l1Scope.Block(keystoneX, keystoneY);
        l1Scope.blocks[2] = new l1Scope.Block(keystoneX + 1, keystoneY);
        l1Scope.blocks[3] = new l1Scope.Block(keystoneX + 1, keystoneY + 1);
    } else if (1 === l1Scope.orientation) {
        // pointing right
        l1Scope.blocks[0] = new l1Scope.Block(keystoneX, keystoneY + 2);
        l1Scope.blocks[1] = new l1Scope.Block(keystoneX, keystoneY + 1);
        l1Scope.blocks[2] = new l1Scope.Block(keystoneX, keystoneY);
        l1Scope.blocks[3] = new l1Scope.Block(keystoneX + 1, keystoneY);
    } else if (2 === l1Scope.orientation) {
        // pointing down
        l1Scope.blocks[0] = new l1Scope.Block(keystoneX + 1, keystoneY + 1);
        l1Scope.blocks[1] = new l1Scope.Block(keystoneX, keystoneY + 1);
        l1Scope.blocks[2] = new l1Scope.Block(keystoneX - 1, keystoneY + 1);
        l1Scope.blocks[3] = new l1Scope.Block(keystoneX - 1, keystoneY);
    } else {
        // pointing left
        l1Scope.blocks[0] = new l1Scope.Block(keystoneX, keystoneY);
        l1Scope.blocks[1] = new l1Scope.Block(keystoneX, keystoneY + 1);
        l1Scope.blocks[2] = new l1Scope.Block(keystoneX, keystoneY + 2);
        l1Scope.blocks[3] = new l1Scope.Block(keystoneX - 1, keystoneY + 2);
    }
}
// Inherit from Shape
L1.prototype = new Shape();
L1.prototype.shapeName = 'L1';
/**
 * Return a shape that is the rotated version of this shape.
 */
L1.prototype.rotate = function() {
    var Rotated;
    if (0 === this.orientation) {
        Rotated = new L1(this.board, this.blocks[1].x, this.blocks[1].y, 1);
    } else if (1 === this.orientation) {
        Rotated = new L1(this.board, this.blocks[2].x, this.blocks[2].y, 2);
    } else if (2 === this.orientation) {
        Rotated = new L1(this.board, this.blocks[1].x, this.blocks[1].y - 1, 3);
    } else {
        Rotated = new L1(this.board, this.blocks[0].x, this.blocks[0].y, 0);
    }
    Rotated.makeFalling();
    return Rotated;
};



/**
 * |--------------------------|
 * | block3 |        |        |
 * |--------------------------|
 * | block0 | block1 | block2 |
 * |--------------------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 * @param startingOrientation
 *      orientation of the shape
 */
function L2 (board, keystoneX, keystoneY, startingOrientation) {
    var l2Scope = this;
    l2Scope.board = board;
    l2Scope.points = 3;
    l2Scope.variations = 4;
    l2Scope.startingOrientation = startingOrientation;
    l2Scope.setStartingOrientation();

    // Initialize the blocks
    l2Scope.blocks = new Array(this.BLOCKS_PER_SHAPE);
    if (0 === l2Scope.orientation) {
        // pointing up
        l2Scope.blocks[0] = new l2Scope.Block(keystoneX - 1, keystoneY);
        l2Scope.blocks[1] = new l2Scope.Block(keystoneX, keystoneY);
        l2Scope.blocks[2] = new l2Scope.Block(keystoneX + 1, keystoneY);
        l2Scope.blocks[3] = new l2Scope.Block(keystoneX - 1, keystoneY + 1);
    } else if (1 === l2Scope.orientation) {
        // pointing right
        l2Scope.blocks[0] = new l2Scope.Block(keystoneX, keystoneY + 2);
        l2Scope.blocks[1] = new l2Scope.Block(keystoneX, keystoneY + 1);
        l2Scope.blocks[2] = new l2Scope.Block(keystoneX, keystoneY);
        l2Scope.blocks[3] = new l2Scope.Block(keystoneX + 1, keystoneY + 2);
    } else if (2 === l2Scope.orientation) {
        // pointing down
        l2Scope.blocks[0] = new l2Scope.Block(keystoneX + 1, keystoneY + 1);
        l2Scope.blocks[1] = new l2Scope.Block(keystoneX, keystoneY + 1);
        l2Scope.blocks[2] = new l2Scope.Block(keystoneX - 1, keystoneY + 1);
        l2Scope.blocks[3] = new l2Scope.Block(keystoneX + 1, keystoneY);
    } else {
        // pointing left
        l2Scope.blocks[0] = new l2Scope.Block(keystoneX, keystoneY);
        l2Scope.blocks[1] = new l2Scope.Block(keystoneX, keystoneY + 1);
        l2Scope.blocks[2] = new l2Scope.Block(keystoneX, keystoneY + 2);
        l2Scope.blocks[3] = new l2Scope.Block(keystoneX - 1, keystoneY);
    }
}
// Inherit from Shape
L2.prototype = new Shape();
L2.prototype.shapeName = 'L2';
/**
 * Return a shape that is the rotated version of this shape.
 */
L2.prototype.rotate = function() {
    var Rotated;
    if (0 === this.orientation) {
        Rotated = new L2(this.board, this.blocks[1].x, this.blocks[1].y, 1);
    } else if (1 === this.orientation) {
        Rotated = new L2(this.board, this.blocks[2].x, this.blocks[2].y, 2);
    } else if (2 === this.orientation) {
        Rotated = new L2(this.board, this.blocks[1].x, this.blocks[1].y - 1, 3);
    } else {
        Rotated = new L2(this.board, this.blocks[0].x, this.blocks[0].y, 0);
    }
    Rotated.makeFalling();
    return Rotated;
};



/**
 * |--------------------------|
 * |        | block2 | block3 |
 * |--------------------------|
 * | block0 | block1 |        |
 * |--------------------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 * @param startingOrientation
 *      orientation of the shape
 */
function S1 (board, keystoneX, keystoneY, startingOrientation) {
    var s1Scope = this;
    s1Scope.board = board;
    s1Scope.points = 4;
    s1Scope.variations = 2;
    s1Scope.startingOrientation = startingOrientation;
    s1Scope.setStartingOrientation();

    // Initialize the blocks
    s1Scope.blocks = new Array(this.BLOCKS_PER_SHAPE);
    if (0 === s1Scope.orientation) {
        // on the side
        s1Scope.blocks[0] = new s1Scope.Block(keystoneX - 1, keystoneY);
        s1Scope.blocks[1] = new s1Scope.Block(keystoneX, keystoneY);
        s1Scope.blocks[2] = new s1Scope.Block(keystoneX, keystoneY + 1);
        s1Scope.blocks[3] = new s1Scope.Block(keystoneX + 1, keystoneY + 1);
    } else {
        // upright
        s1Scope.blocks[0] = new s1Scope.Block(keystoneX, keystoneY);
        s1Scope.blocks[1] = new s1Scope.Block(keystoneX, keystoneY + 1);
        s1Scope.blocks[2] = new s1Scope.Block(keystoneX - 1, keystoneY + 1);
        s1Scope.blocks[3] = new s1Scope.Block(keystoneX - 1, keystoneY + 2);
    }
}
// Inherit from Shape
S1.prototype = new Shape();
S1.prototype.shapeName = 'S1';
/**
 * Return a shape that is the rotated version of this shape.
 */
S1.prototype.rotate = function() {
    var Rotated;
    if (0 === this.orientation) {
        Rotated = new S1(this.board, this.blocks[1].x, this.blocks[1].y, 1);
    } else {
        Rotated = new S1(this.board, this.blocks[0].x, this.blocks[0].y, 0);
    }
    Rotated.makeFalling();
    return Rotated;
};



/**
 * |--------------------------|
 * | block0 | block1 |        |
 * |--------------------------|
 * |        | block2 | block3 |
 * |--------------------------|
 * @param board
 *      game board where this shape is falling
 * @param keystoneX
 *      x value for the kesytone - the shape is built around this square
 * @param keystoneY
 *      y value for the kesytone - the shape is built around this square
 * @param startingOrientation
 */
function S2 (board, keystoneX, keystoneY, startingOrientation) {
    var s2Scope = this;
    s2Scope.board = board;
    s2Scope.points = 4;
    s2Scope.variations = 2;
    s2Scope.startingOrientation = startingOrientation;
    s2Scope.setStartingOrientation();

    // Initialize the blocks
    s2Scope.blocks = new Array(this.BLOCKS_PER_SHAPE);
    if (0 === s2Scope.orientation) {
        // on the side
        s2Scope.blocks[0] = new s2Scope.Block(keystoneX - 1, keystoneY + 1);
        s2Scope.blocks[1] = new s2Scope.Block(keystoneX, keystoneY + 1);
        s2Scope.blocks[2] = new s2Scope.Block(keystoneX, keystoneY);
        s2Scope.blocks[3] = new s2Scope.Block(keystoneX + 1, keystoneY);
    } else {
        // upright
        s2Scope.blocks[0] = new s2Scope.Block(keystoneX + 1, keystoneY + 2);
        s2Scope.blocks[1] = new s2Scope.Block(keystoneX + 1, keystoneY + 1);
        s2Scope.blocks[2] = new s2Scope.Block(keystoneX, keystoneY + 1);
        s2Scope.blocks[3] = new s2Scope.Block(keystoneX, keystoneY);
    }
}
// Inherit from Shape
S2.prototype = new Shape();
S2.prototype.shapeName = 'S2';
/**
 * Return a shape that is the rotated version of this shape.
 */
S2.prototype.rotate = function() {
    var Rotated;
    if (0 === this.orientation) {
        Rotated = new S2(this.board, this.blocks[2].x, this.blocks[2].y, 1);
    } else {
        Rotated = new S2(this.board, this.blocks[3].x, this.blocks[3].y, 0);
    }
    Rotated.makeFalling();
    return Rotated;
};
