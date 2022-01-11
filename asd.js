/* Game of Life
 * Implemented in TypeScript
 * To learn more about TypeScript, please visit http://www.typescriptlang.org/
 */
var Conway;
(function (Conway) {
    var Cell = /** @class */ (function () {
        function Cell(row, col, live) {
            this.row = row;
            this.col = col;
            this.live = live;
        }
        return Cell;
    }());
    Conway.Cell = Cell;
    var GameOfLife = /** @class */ (function () {
        function GameOfLife() {
            this.gridSize = 50;
            this.canvasSize = 600;
            this.lineColor = '#cdcdcd';
            this.liveColor = '#666';
            this.deadColor = '#eee';
            this.initialLifeProbability = 0.5;
            this.animationRate = 60;
            this.cellSize = 0;
            this.world = this.createWorld();
            this.circleOfLife();
        }
        GameOfLife.prototype.createWorld = function () {
            var _this = this;
            return this.travelWorld(function (cell) {
                cell.live = Math.random() < _this.initialLifeProbability;
                return cell;
            });
        };
        GameOfLife.prototype.circleOfLife = function () {
            var _this = this;
            this.world = this.travelWorld(function (cell) {
                cell = _this.world[cell.row][cell.col];
                _this.draw(cell);
                return _this.resolveNextGeneration(cell);
            });
            setTimeout(function () { _this.circleOfLife(); }, this.animationRate);
        };
        GameOfLife.prototype.resolveNextGeneration = function (cell) {
            var count = this.countNeighbors(cell);
            var newCell = new Cell(cell.row, cell.col, cell.live);
            if (count < 2 || count > 3)
                newCell.live = false;
            else if (count == 3)
                newCell.live = true;
            return newCell;
        };
        GameOfLife.prototype.countNeighbors = function (cell) {
            var neighbors = 0;
            for (var row = -1; row <= 1; row++) {
                for (var col = -1; col <= 1; col++) {
                    if (row == 0 && col == 0)
                        continue;
                    if (this.isAlive(cell.row + row, cell.col + col)) {
                        neighbors++;
                    }
                }
            }
            return neighbors;
        };
        GameOfLife.prototype.isAlive = function (row, col) {
            if (row < 0 || col < 0 || row >= this.gridSize || col >= this.gridSize)
                return false;
            return this.world[row][col].live;
        };
        GameOfLife.prototype.travelWorld = function (callback) {
            var result = [];
            for (var row = 0; row < this.gridSize; row++) {
                var rowData = [];
                for (var col = 0; col < this.gridSize; col++) {
                    rowData.push(callback(new Cell(row, col, false)));
                }
                result.push(rowData);
            }
            return result;
        };
        GameOfLife.prototype.draw = function (cell) {
            if (this.context == null)
                this.context = this.createDrawingContext();
            if (this.cellSize == 0)
                this.cellSize = this.canvasSize / this.gridSize;
            this.context.strokeStyle = this.lineColor;
            this.context.strokeRect(cell.row * this.cellSize, cell.col * this.cellSize, this.cellSize, this.cellSize);
            this.context.fillStyle = cell.live ? this.liveColor : this.deadColor;
            this.context.fillRect(cell.row * this.cellSize, cell.col * this.cellSize, this.cellSize, this.cellSize);
        };
        GameOfLife.prototype.createDrawingContext = function () {
            var canvas = document.getElementById('conway-canvas');
            if (canvas == null) {
                canvas = document.createElement('canvas');
                canvas.id = 'conway-canvas';
                canvas.width = this.canvasSize;
                canvas.height = this.canvasSize;
                document.body.appendChild(canvas);
            }
            return canvas.getContext('2d');
        };
        return GameOfLife;
    }());
    Conway.GameOfLife = GameOfLife;
})(Conway || (Conway = {}));
var game = new Conway.GameOfLife();
