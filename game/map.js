const MAP_SYMBOL_START = 'X';
const MAP_SYMBOL_PATH = 'x';
const MAP_SYMBOL_END = '0';

var map = [
	'    X           ',
	'   xx           ',
	'   x      xxx   ',
	'   xx     x x   ',
	'    xxxx  x x   ',
	'       xxxx x   ',
	'            x   ',
	'       xxxxxx   ',
	'       0        ',
];

function getCellCenterCoords(context, cellX, cellY) {
	var cellSize = getCellSize(context);
	return vec(cellSize.x * (cellX + 0.5), cellSize.y * (cellY + 0.5));
}

function getCellSize(size) {
	return vec(
		size.x / map[0].length,
		size.y / map.length
	);
}

function setCellContent(cell, content) {
	map[cell.y] = map[cell.y].substr(0, cell.x) + content + map[cell.y].substr(cell.x + 1);
}

function getCellContent(cell) {
	return (map[cell.y] || [])[cell.x];
}

function getStartCellCoords() {
	var coords = {};
	map.forEach(function(row, y) {
		var index = row.indexOf(MAP_SYMBOL_START);
		if (index > -1) {
			coords.x = index;
			coords.y = y;
		}
	});
	return coords;
}

function getNearbyCells(cell) {
	return [
		vec(cell.x, cell.y - 1),
		vec(cell.x, cell.y + 1),
		vec(cell.x - 1, cell.y),
		vec(cell.x + 1, cell.y)
	];
}

function getCellByCoords(canvasSize, coords) {
	var cellSize = getCellSize(canvasSize);
	return vmap(vdiv(coords, cellSize), Math.floor);
}

