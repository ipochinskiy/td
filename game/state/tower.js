var towers = [];

var Tower = (function() {
	const towerRadiusMultiplier = 0.45;
	const getTowerRadius = cellSize => cellSize.x * towerRadiusMultiplier;

	const towerRenderStyle = {
		fill: 'blue',
		stroke: 'black',
		lineWidth: 3
	};

	const rangeRenderStyle = {
		fill: 'blue',
		stroke: 'black',
		lineWidth: 2
	};

	const renderTower = (context, tower) => {
		var cellSize = Map.getCellSize();

		var towerCenter = getCellCenterCoords(tower.pos);
		PrimitiveRenderer.circle(context, towerRenderStyle, towerCenter, getTowerRadius(cellSize));

		var oldAlpha = context.globalAlpha;
		context.globalAlpha = 0.4;
		PrimitiveRenderer.circle(context, rangeRenderStyle, towerCenter, cellSize.x * tower.range);
		context.globalAlpha = oldAlpha;
	}

	return {
		getDefaultTower: cell => ({
			pos: vclone(cell),
			power: 5,
			range: 1.5,
			cooldown: 0.8,
			slots: []
		}),
		isTargetAvailable: (tower, target) =>
			isPointInCircle(target, tower.pos, tower.range) && Enemy.isEnemyAlive(target),
		renderTowers: function(context) {
			towers.forEach(renderTower.bind(null, context));
		},
	};
})();
