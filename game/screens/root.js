var RootScreen = function() {
	var blueprint = { cell: vec(0, 0), valid: false };

	var canvasSize = vec(0, 0);

	var behaviorSystem = BehaviorSystem();

	var Enemy = initEnemy(behaviorSystem);
	var Tower = initTowers(behaviorSystem, Enemy);
	var Wave = initWaves(Enemy.spawnEnemy);

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');

				var enemiesAlive = enemies.filter(isEnemyAlive);

				var context = event.context;
				canvasSize = vec(context.canvas.width, context.canvas.height);

				var cellSize = getCellSize(canvasSize);

				drawMap(context, cellSize.x, cellSize.y);

				towers.forEach(drawTower.bind(null, context, cellSize.x, cellSize.y));
				enemiesAlive.forEach(drawEnemy.bind(null, context, cellSize.x, cellSize.y));

				var color = blueprint.valid ? 'green' : 'red';
				drawHighlightedCell(context, cellSize, blueprint.cell, color);
			}
		}),
		function (event) {
			behaviorSystem.update(event);
			return { done: false };
		},
		Behavior.run(function*() {
			while(true) {
				var event = yield Behavior.first(
					Behavior.run(function*() {
						while (true) {
							var event = yield Behavior.type('mousemove');
							blueprint.cell = getCellByCoords(canvasSize, event.pos);
							blueprint.valid = getCellContent(blueprint.cell) === ' ';
						}
					}),
					Behavior.type('mousedown')
				);

				var cellUnderMouse = getCellByCoords(canvasSize, event.pos);
				var cellContent = getCellContent(cellUnderMouse);

				if (cellContent === ' ') {
					behaviorSystem.add(Tower.buildTower(cellUnderMouse));
				}
			}
		}),
		Behavior.run(function*() {
			behaviorSystem.add(Wave.spawnWave());
		})
	);
}