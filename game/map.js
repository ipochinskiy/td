var Map = (function() {	
	const MAP_SYMBOL_START = 'X';
	const MAP_SYMBOL_PATH = 'x';
	const MAP_SYMBOL_END = '0';
	const MAP_SYMBOL_FREE = ' ';

	var map = {
		pos: vec(0, 0), size: vec(0, 0), cellSize: vec(0, 0)
	};

	var level = [
		'                ',
		'Xxxx      xxx   ',
		'   xx     x x   ',
		'    xxxx  x x   ',
		'       xxxx x   ',
		'            x   ',
		'      0xxxxxx   ',
		'                ',
	];

	const getCellContent = cell => (level[cell.y] || [])[cell.x];

	const isCellPath = cell => {
		var content = getCellContent(cell);
		return content === MAP_SYMBOL_PATH || content === MAP_SYMBOL_START;
	}

	const isCellCastle = cell => getCellContent(cell) === MAP_SYMBOL_END;

	const renderPath = (context, cell) => {
		PrimitiveRenderer.rect(context, {
			fill: 'gray'
		}, vmul(map.cellSize, cell), map.cellSize);
	}

	const renderCastle = (context, cell) => {
		PrimitiveRenderer.rect(context, {
			fill: 'green'
		}, vmul(map.cellSize, cell), map.cellSize);
	}

	return {
		setSize: size => {
			map.size = size;
			map.cellSize = vdiv(size, vec(level[0].length, level.length));
		},
		getCellSize: () => map.cellSize,
		getCellByCoords: coords => vmap(vdiv(coords, map.cellSize), Math.floor),
		getNearbyCells: cell => [
			vec(cell.x, cell.y - 1),
			vec(cell.x, cell.y + 1),
			vec(cell.x - 1, cell.y),
			vec(cell.x + 1, cell.y)
		],
		isMouseOver: pos => isPointInsideRect(pos, map),

		setCellContent: (cell, content) => {
			level[cell.y] = level[cell.y].substr(0, cell.x) + content + level[cell.y].substr(cell.x + 1);
		},
		isCellFree: cell => getCellContent(cell) === MAP_SYMBOL_FREE,
		isCellPath: isCellPath,
		render: context => {
			level.forEach(function(row, y) {
				for (var x = 0; x < row.length; x++) {
					var cell = vec(x, y);

					if (isCellPath(cell)) {
						renderPath(context, cell);
					} else if (isCellCastle(cell)) {
						renderCastle(context, cell);
					}
				}
			});
		},
	};
})();

