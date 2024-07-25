class Tetris {
    constructor(selector) {
        this.board = document.querySelector(selector);
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.createBoard();
        this.addEventListeners();

        this.pieces = [
            { shape: [
                [1, 0], 
                [1, 0], 
                [1, 1]], color: 'orange' },
            { shape: [
                [0, 1], 
                [0, 1], 
                [1, 1]], color: 'blue' },
            { shape: [
                [1, 1, 0], 
                [0, 1, 1]
            ], color: 'red' },
            { shape: [
                [0, 1, 1], 
                [1, 1, 0]
            ], color: 'green' },
            { shape: [
                [1, 1, 1], 
                [0, 1, 0]
            ], color: 'purple' },
            { shape: [
                [1, 1], 
                [1, 1]
            ], color: 'yellow' },
            { shape: [
                [1], [1], [1], [1]], color: 'cyan' },
        ];
        this.resetPiece();
        this.drawPiece();
        this.startGame();
    }

    createBoard() {
        this.grid = Array.from({ 
            length: this.boardHeight 
        }, () => Array(this.boardWidth).fill(0));
        this.cells = [];

        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const div = document.createElement('div');
                div.className = 'grid-cell';
                this.board.appendChild(div);
                this.cells.push(div);
            }
        }
    }

    startGame() {
        this.interval = setInterval(() => {
            this.movePiece('down');
        }, 1000);
    }

    stopGame() {
        clearInterval(this.interval);
    }

    resetPiece() {
        const rand = Math.floor(Math.random() * this.pieces.length);
        this.activePiece = this.pieces[rand];
        this.piecePosition = { x: Math.floor(this.boardWidth / 2) - 1, y: 0 };

        if (!this.isValidMove(this.piecePosition.x, this.piecePosition.y, this.activePiece.shape)) {
            this.stopGame();
            alert('Perdió!');
        }
    }

    drawPiece() {
        this.activePiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const index = (this.piecePosition.y + y) * this.boardWidth + (this.piecePosition.x + x);
                    if (this.cells[index]) {
                        this.cells[index].style.backgroundColor = this.activePiece.color;
                    }
                }
            });
        });
    }

    clearPiece() {
        this.activePiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const index = (this.piecePosition.y + y) * this.boardWidth + (this.piecePosition.x + x);
                    if (this.cells[index]) {
                        this.cells[index].style.backgroundColor = '';
                    }
                }
            });
        });
    }

    movePiece(direction) {
        this.clearPiece();
        let newX = this.piecePosition.x;
        let newY = this.piecePosition.y;

        if (direction === 'left') {
            newX--;
        } else if (direction === 'right') {
            newX++;
        } else if (direction === 'down') {
            newY++;
        }

        if (this.isValidMove(newX, newY, this.activePiece.shape)) {
            this.piecePosition.x = newX;
            this.piecePosition.y = newY;
        } else if (direction === 'down') {
            this.lockPiece();
            this.resetPiece();
        }

        this.drawPiece();
    }

    rotatePiece() {
        this.clearPiece();
        const rotatedPiece = this.activePiece.shape[0].map((_, index) => this.activePiece.shape.map(row => row[index])).reverse();

        if (this.isValidMove(this.piecePosition.x, this.piecePosition.y, rotatedPiece)) {
            this.activePiece.shape = rotatedPiece;
        }

        this.drawPiece();
    }

    isValidMove(x, y, shape) {
        return shape.every((row, dy) => {
            return row.every((cell, dx) => {
                const newX = x + dx;
                const newY = y + dy;
                return (
                    cell === 0 ||
                    (this.isInBounds(newX, newY) && this.grid[newY][newX] === 0)
                );
            });
        });
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
    }

    lockPiece() {
        this.activePiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.grid[this.piecePosition.y + y][this.piecePosition.x + x] = cell;
                }
            });
        });

        this.clearLines();
    }

    clearLines() {
        this.grid = this.grid.filter(row => row.some(cell => !cell));

        while (this.grid.length < this.boardHeight) {
            this.grid.unshift(new Array(this.boardWidth).fill(0));
        }

        this.updateBoard();
    }

    updateBoard() {
        this.cells.forEach((cell, index) => {
            const x = index % this.boardWidth;
            const y = Math.floor(index / this.boardWidth);

            cell.style.backgroundColor = this.grid[y][x] ? 'gray' : '';
        });
    }

    handleKeyInput(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
                this.movePiece('left');
                break;
            case 'ArrowUp':
            case 'w':
                this.rotatePiece();
                break;
            case 'ArrowRight':
            case 'd':
                this.movePiece('right');
                break;
            case 'ArrowDown':
            case 's':
                this.movePiece('down');
                break;
        }
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyInput(e));
        document.getElementById('left-button').addEventListener('click', () => this.movePiece('left'));
        document.getElementById('rotate-button').addEventListener('click', () => this.rotatePiece());
        document.getElementById('right-button').addEventListener('click', () => this.movePiece('right'));
        document.getElementById('down-button').addEventListener('click', () => this.movePiece('down'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tetris = new Tetris('#tetris-board');
});