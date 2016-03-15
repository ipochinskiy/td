const MAP_SYMBOL_START = 'X';
const MAP_SYMBOL_PATH = 'x';
const MAP_SYMBOL_END = '0';

var map = [
	'                ',
	'Xxxx      xxx   ',
	'   xx     x x   ',
	'    xxxx  x x   ',
	'       xxxx x   ',
	'            x   ',
	'      0xxxxxx   ',
	'                ',
];

function getCellCenterCoords(context, cellX, cellY) {
	var cellSize = getCellSize(context);
	return vec(cellSize.x * (cellX + 0.5), cellSize.y * (cellY + 0.5));
}

function getCellSize(size) {
	return vdiv(size, vec(map[0].length, map.length));
}

function isCellPath(cell) {
	var content = getCellContent(cell);
	return content === MAP_SYMBOL_PATH || content === MAP_SYMBOL_START;
}

function isCellCastle(cell) {
	var content = getCellContent(cell);
	return content === MAP_SYMBOL_END;
}

function setCellContent(cell, content) {
	map[cell.y] = map[cell.y].substr(0, cell.x) + content + map[cell.y].substr(cell.x + 1);
}

function getCellContent(cell) {
	return (map[cell.y] || [])[cell.x];
}

function isCellFree(cell) {
	return getCellContent(cell) === ' ';
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

function getCellByCoords(mapSize, coords) {
	var cellSize = getCellSize(mapSize);
	return vmap(vdiv(coords, cellSize), Math.floor);
}

