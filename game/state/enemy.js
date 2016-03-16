var Enemy = (function() {
	const bulletRadiusMultiplier = 0.02;
	const enemyRadiusMultiplier = 0.1;

	const enemyStyle = {
		fill: 'black',
		stroke: 'black',
		lineWidth: 1
	}

	const rangeStyle = {
		fill: 'red',
		stroke: 'black',
		lineWidth: 1
	}

	const getBulletRadius = cellSize => cellSize.x * bulletRadiusMultiplier;
	const getEnemyRadius = cellSize => cellSize.x * enemyRadiusMultiplier;

	const isEnemyAlive = enemy => enemy.hp > 0;
	const isStepBack = (enemy, step) => veq(enemy.previousPosition, step);

	const renderBullet = (context, cellSize, bullet) =>
		PrimitiveRenderer.circle(context, enemyStyle, getCellCenterCoords(bullet.pos), getBulletRadius(cellSize));

	const renderEnemy = (context, enemy) => {
		var cellSize = Map.getCellSize();
		var enemyCenter = getCellCenterCoords(enemy.currentPosition);

		enemy.bullets.forEach(renderBullet.bind(null, context, cellSize));
		PrimitiveRenderer.circle(context, rangeStyle, enemyCenter, getEnemyRadius(cellSize));

		//	just for debug purpose
		StringRenderer.render(context, enemy.hp, {
			fill: 'black',
			height: 16,
			font: 'Arial',
			halign: 'center',
			valign: 'bottom'
		}, vadd(enemyCenter, vec(0, -15)));
	}

	return {
		getDefaultEnemy: () => ({
			hp: 10,
			speed: 1,
			currentPosition: vec(-1, 1),
			previousPosition: vec(-1, 1),
			bullets: []
		}),
		isEnemyAlive: isEnemyAlive,
		getNextStep: function(enemy) {
			return Map.getNearbyCells(enemy.currentPosition).filter(cell =>
				Map.isCellPath(cell) && !isStepBack(enemy, cell))[0];
		},
		getEnemiesInCircle: function(center, radius) {
			return enemies.filter(enemy =>
				isEnemyAlive(enemy) && isPointInCircle(enemy, center, radius));
		},
		renderEnemies: function(context, enemy) {
			enemies.filter(isEnemyAlive).forEach(renderEnemy.bind(null, context));
		},
	}
})();
