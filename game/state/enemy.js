var waves = [
	{ enemiesCount: 2, delay: 1 },
	{ enemiesCount: 2, delay: 3 },
	{ enemiesCount: 5, delay: 5 },
	{ enemiesCount: 10, delay: 8 },
	{ enemiesCount: 20, delay: 15 },
];

var enemies = [];

var Enemy = (function() {
	const bulletRadiusMultiplier = 0.02;
	const enemyRadiusMultiplier = 0.1;

	const getBulletRadius = cellSize => cellSize.x * bulletRadiusMultiplier;
	const getEnemyRadius = cellSize => cellSize.x * enemyRadiusMultiplier;

	const isEnemyAlive = enemy => enemy.hp > 0;
	const isStepBack = (enemy, step) => veq(enemy.previousPosition, step);

	const renderBullet = (context, cellSize, bullet) => {
		var center = getCellCenterCoords(bullet.pos);
		var radius = getBulletRadius(cellSize);
		PrimitiveRenderer.circle(context, STYLE_BULLET, center, radius);
	};

	const renderEnemy = (context, enemy) => {
		var cellSize = Map.getCellSize();
		var enemyCenter = getCellCenterCoords(enemy.currentPosition);

		enemy.bullets.forEach(renderBullet.bind(null, context, cellSize));
		PrimitiveRenderer.circle(context, STYLE_ENEMY, enemyCenter, getEnemyRadius(cellSize));

		//	just for debug purpose
		StringRenderer.render(context, enemy.hp, {
			fill: 'black',
			height: 16,
			font: 'Arial',
			halign: 'center',
			valign: 'bottom'
		}, vadd(enemyCenter, vec(0, -15)));
	}

	const findStartPosition = () => {
		var startCell = Map.getStartCell();
		if (veq(startCell, vec(0, 0))) { return vec(-1, 0); }

		var x = startCell.x === 0 ? -1 : startCell.x;
		var y = startCell.y === 0 ? -1 : startCell.y;

		return vec(x, y);
	};

	return {
		getDefaultEnemy: () => ({
			hp: ENEMY_HEALTH,
			speed: ENEMY_SPEED,
			currentPosition: findStartPosition(),
			previousPosition: findStartPosition(),
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
