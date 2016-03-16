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

	function drawString(string, pos) {
		context.fillStyle = 'black';
		context.font = '16px Arial';
		context.textAlign = 'center';
		context.textBaseline = 'bottom';

		context.fillText(string, pos.x, pos.y);
	}

	return {
		drawEnemy: function(enemy) {
			const bulletRadiusMultiplier = 0.02;
			const bulletRadius = cellSize.x * bulletRadiusMultiplier;

			enemy.bullets.forEach(function(bullet) {
				PrimitiveRenderer.circle(context, {
					fill: 'black',
					stroke: 'black',
					lineWidth: 1
				}, getCellCenterCoords(bullet.pos), bulletRadius);
			});

			const enemyRadiusMultiplier = 0.1;
			const enemyRadius = cellSize.x * enemyRadiusMultiplier;

			var enemyCenter = getCellCenterCoords(enemy.currentPosition);

			PrimitiveRenderer.circle(context, {
				fill: 'red',
				stroke: 'black',
				lineWidth: 1
			}, enemyCenter, enemyRadius);

			var textPos = vadd(enemyCenter, vec(0, -15));
			drawString(enemy.hp, textPos);
		},
	};
}
