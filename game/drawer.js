var initDrawer = function(context, cellSize) {
	function drawCircle(color, lineWidth, center, radius) {
		context.fillStyle = color;
		context.strokeStyle = 'black';
		context.lineWidth = lineWidth;
		context.beginPath();
		context.arc(center.x, center.y, radius, 0, Math.PI * 2);
		context.fill();
		context.stroke();
	}

	function drawRect(color, pos, size) {
		context.fillStyle = color;
		context.fillRect(pos.x, pos.y, size.x, size.y);
	}

	function drawString(string, pos) {
		context.fillStyle = 'black';
		context.font = '16px Arial';
		context.textAlign = 'center';
		context.textBaseline = 'bottom';

		context.fillText(string, pos.x, pos.y);
	}

	function getCircleCenter(pos) {
		return vmul(cellSize, vadd(pos, vec(0.5, 0.5)));
	}

	return {
		drawMap: function() {
			map.forEach(function(row, y) {
				for (var x = 0; x < row.length; x++) {
					var cell = vec(x, y);
					if (isCellPath(cell)) {
						var color = 'gray';
					} else if (isCellCastle(cell)) {
						var color =  'green';
					} else {
						continue;
					}
					drawRect(color, vmul(cellSize, vec(x, y)), cellSize);
				}
			});
		},
		drawEnemy: function(enemy) {
			enemy.bullets.forEach(bullet => drawCircle('black', 1,
				getCircleCenter(bullet.position), cellSize.x * 0.02));

			drawCircle('red', 1, getCircleCenter(enemy.currentPosition), cellSize.x * 0.1);

			var textPos = vadd(getCircleCenter(enemy.currentPosition), vec(0, -15));
			drawString(enemy.hp, textPos);
		},
		drawTower: function(tower) {
			drawCircle('blue', 3, getCircleCenter(tower.position), cellSize.x * 0.45);

			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.4;
			drawCircle('blue', 2, getCircleCenter(tower.position), cellSize.x * tower.range);
			context.globalAlpha = oldAlpha;
		},
		drawHighlightedCell: function(cell, color) {
			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.4;
			drawRect(color, vmul(cellSize, cell), cellSize);
			context.globalAlpha = oldAlpha;
		}
	};
}
