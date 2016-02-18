var RootScreen = function() {
	var blueprint = { cell: vec(0, 0), valid: false };

	var canvasSize = vec(0, 0);

	var behaviorSystem = BehaviorSystem();

	var Enemy = initEnemy(behaviorSystem);
	var Tower = initTowers(behaviorSystem);
	var Wave = initWaves(Enemy.spawnEnemy);

	var Drawer = initDrawer();

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');
				var context = event.context;
				canvasSize = vec(context.canvas.width, context.canvas.height);

				var cellSize = getCellSize(canvasSize);

				Drawer.drawMap(context, cellSize);

				towers.forEach(Drawer.drawTower.bind(null, context, cellSize));
				enemies.filter(isEnemyAlive)
					.forEach(Drawer.drawEnemy.bind(null, context, cellSize));

				var color = blueprint.valid ? 'green' : 'red';
				Drawer.drawHighlightedCell(context, cellSize, blueprint.cell, color);
			}
		}),
		function (event) {
			behaviorSystem.update(event);
			return { done: false };
		},
		Behavior.run(function*() {
			behaviorSystem.add(Wave.spawnWave());

			while(true) {
				var event = yield Behavior.first(
					Behavior.run(function*() {
						while (true) {
							var event = yield Behavior.type('mousemove');
							blueprint.cell = getCellByCoords(canvasSize, event.pos);
							blueprint.valid = isCellFree(blueprint.cell);
						}
					}),
					Behavior.type('mousedown')
				);

				var cellUnderMouse = getCellByCoords(canvasSize, event.pos);
				if (isCellFree(cellUnderMouse)) {
					behaviorSystem.add(Tower.buildTower(cellUnderMouse));
				}
			}
		})
	);
}