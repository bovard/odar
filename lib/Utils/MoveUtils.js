/**
 * Tries to move ahead, left, right
 * @param unitController
 * @param dirToMove
 * @returns {boolean} if we moved
 */
function tryMoveAheadLeftRight(unitController, dirToMove) {
    if (unitController.canMove(dirToMove)) {
        unitController.move(dirToMove);
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft())) {
        unitController.move(dirToMove.rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight())) {
        unitController.move(dirToMove.rotateRight());
        return true;
    }
    return false;
}

/**
 * Tries to move ahead, left, right, leftLeft, rightRight
 * @param unitController
 * @param dirToMove
 * @returns {boolean} if we moved
 */
function tryMoveAheadLeftRightSideways(unitController, dirToMove) {
    if (unitController.canMove(dirToMove)) {
        unitController.move(dirToMove);
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft())) {
        unitController.move(dirToMove.rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight())) {
        unitController.move(dirToMove.rotateRight());
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft().rotateLeft())) {
        unitController.move(dirToMove.rotateLeft().rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight().rotateRight())) {
        unitController.move(dirToMove.rotateRight().rotateRight());
        return true;
    }
    return false;

}

/**
 * Tries to move ahed, left, right, leftLeft, rightRight, leftLeftLeft, rightRightRight
 * @param unitController
 * @param dirToMove
 * @returns {boolean} if we moved
 */
function tryMoveAnywhereButBackwards(unitController, dirToMove) {
    if (unitController.canMove(dirToMove)) {
        unitController.move(dirToMove);
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft())) {
        unitController.move(dirToMove.rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight())) {
        unitController.move(dirToMove.rotateRight());
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft().rotateLeft())) {
        unitController.move(dirToMove.rotateLeft().rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight().rotateRight())) {
        unitController.move(dirToMove.rotateRight().rotateRight());
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft().rotateLeft().rotateLeft())) {
        unitController.move(dirToMove.rotateLeft().rotateLeft().rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight().rotateRight().rotateRight())) {
        unitController.move(dirToMove.rotateRight().rotateRight().rotateRight());
        return true;
    }
    return false;
}


/**
 * Tries to move anywhere, starting with dirToMove
 * @param unitController
 * @param dirToMove
 */
function tryMoveAnywhere(unitController, dirToMove) {
    if (unitController.canMove(dirToMove)) {
        unitController.move(dirToMove);
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft())) {
        unitController.move(dirToMove.rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight())) {
        unitController.move(dirToMove.rotateRight());
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft().rotateLeft())) {
        unitController.move(dirToMove.rotateLeft().rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight().rotateRight())) {
        unitController.move(dirToMove.rotateRight().rotateRight());
        return true;
    } else if (unitController.canMove(dirToMove.rotateLeft().rotateLeft().rotateLeft())) {
        unitController.move(dirToMove.rotateLeft().rotateLeft().rotateLeft());
        return true;
    } else if (unitController.canMove(dirToMove.rotateRight().rotateRight().rotateRight())) {
        unitController.move(dirToMove.rotateRight().rotateRight().rotateRight());
        return true;
    } else if (unitController.canMove(dirToMove.opposite())) {
        unitController.move(dirToMove.opposite());
        return true;
    }
    return false;
}

module.exports = {
    tryMoveAheadLeftRight: tryMoveAheadLeftRight,
    tryMoveAheadLeftRightSideways: tryMoveAheadLeftRightSideways,
    tryMoveAnywhereButBackwards: tryMoveAnywhereButBackwards,
    tryMoveAnywhere: tryMoveAnywhere
};