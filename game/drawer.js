function drawCircle(context, color, lineWidth, points) {
	context.fillStyle = color;
	context.strokeStyle = 'black';
	context.lineWidth = lineWidth;
	context.beginPath();
	context.arc(points.x, points.y, points.r, 0, Math.PI * 2);
	context.fill();
	context.stroke();
}

function drawRect(context, color, x, y, sx, sy) {
	context.fillStyle = color;
	context.fillRect(x, y, sx, sy);
}

function drawMap(context, cellWidth, cellHeight) {
	map.forEach(function(row, y) {
		for (var x = 0; x < row.length; x++) {
			if (row[x] === MAP_SYMBOL_PATH || row[x] === MAP_SYMBOL_START) {
				drawRect(context, 'gray', cellWidth * x, cellHeight * y, cellWidth, cellHeight);
			} else if (row[x] === MAP_SYMBOL_END) {
				drawRect(context, 'green', cellWidth * x, cellHeight * y, cellWidth, cellHeight);
			}
		}
	});
}

function drawHighlightedCell(context, cellSize, cell, color) {
	var oldAlpha = context.globalAlpha;
	context.globalAlpha = 0.4;
	drawRect(context, color,
		cellSize.x * cell.x,
		cellSize.y * cell.y,
		cellSize.x, cellSize.y
	);
	context.globalAlpha = oldAlpha;
}

function drawTower(context, width, height, tower) {
	drawCircle(context, 'blue', 3, {
		x: width * (tower.x + 0.5),
		y: height * (tower.y + 0.5),
		r: width * 0.45
	});
	var oldAlpha = context.globalAlpha;
	context.globalAlpha = 0.4;
	drawCircle(context, 'blue', 2, {
		x: width * (tower.x + 0.5),
		y: height * (tower.y + 0.5),
		r: width * tower.range
	});
	context.globalAlpha = oldAlpha;
}

function drawEnemy(context, width, height, enemy, index) {
	// console.log('draw enemy #' + index);
	enemy.bullets.filter(bullet => !bullet.used).forEach((bullet) => drawCircle(context, 'black', 1, {
		x: width * (bullet.position.x + 0.5),
		y: height * (bullet.position.y + 0.5),
		r: width * 0.02
	}));
	drawCircle(context, 'red', 1, {
		x: width * (enemy.currentPosition.x + 0.5),
		y: height * (enemy.currentPosition.y + 0.5),
		r: width * 0.1
	});

	var textPos = vadd(vmul(vec(width, height), vadd(enemy.currentPosition, vec(0.5, 0.5))), vec(0, -15));
	drawString(context, enemy.hp, textPos);
}

function drawString(context, string, pos) {
	context.fillStyle = 'black';
	context.font = '16px Arial';
	context.textAlign = 'center';
	context.textBaseline = 'bottom';

	context.fillText(string, pos.x, pos.y);
}

