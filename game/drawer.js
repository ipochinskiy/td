var initDrawer = function(cellSize) {
	function drawCircle(context, color, lineWidth, center, radius) {
		context.fillStyle = color;
		context.strokeStyle = 'black';
		context.lineWidth = lineWidth;
		context.beginPath();
		context.arc(center.x, center.y, radius, 0, Math.PI * 2);
		context.fill();
		context.stroke();
	}

	function drawRect(context, color, pos, size) {
		context.fillStyle = color;
		context.fillRect(pos.x, pos.y, size.x, size.y);
	}

	function drawString(context, string, pos) {
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
		drawMap: function(context) {
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
					drawRect(context, color, vmul(cellSize, vec(x, y)), cellSize);
				}
			});
		},
		drawEnemy: function(context, enemy) {
			var circleCenter = getCircleCenter.bind(null);
			enemy.bullets.forEach(bullet => drawCircle(context, 'black', 1,
				circleCenter(bullet.position), cellSize.x * 0.02));

			drawCircle(context, 'red', 1, circleCenter(enemy.currentPosition), cellSize.x * 0.1);

			var textPos = vadd(circleCenter(enemy.currentPosition), vec(0, -15));
			drawString(context, enemy.hp, textPos);
		},
		drawTower: function(context, tower) {
			var circleCenter = getCircleCenter.bind(null);
			drawCircle(context, 'blue', 3, circleCenter(tower.position), cellSize.x * 0.45);

			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.4;
			drawCircle(context, 'blue', 2, circleCenter(tower.position), cellSize.x * tower.range);
			context.globalAlpha = oldAlpha;
		},
		drawHighlightedCell: function(context, cell, color) {
			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.4;
			drawRect(context, color, vmul(cellSize, cell), cellSize);
			context.globalAlpha = oldAlpha;
		},
		drawInventory: function(context, inventory) {
			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.6;
			drawRect(context, 'black', inventory.position, inventory.size);
			context.globalAlpha = oldAlpha;
		}
	};
}
