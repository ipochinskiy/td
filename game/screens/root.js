var RootScreen = function() {
	var blueprint = { cell: vec(0, 0), valid: false, shown: false };

	var inventory = { position: vec(0, 0), size: vec(0, 0) };
	var map = { position: vec(0, 0), size: vec(0, 0) };

	var canvasSize = vec(0, 0);
	var mapSize = vec(0, 0);

	var behaviorSystem = BehaviorSystem();

	var Enemy = initEnemy(behaviorSystem);
	var Tower = initTowers(behaviorSystem);
	var Wave = initWaves(Enemy.spawnEnemy);

	var Drawer = initDrawer();

	function isMouseOverMap(cursor, map) {
		var sum = vadd(map.position, map.size);
		return map.position.x <= cursor.x && cursor.x <= sum.x &&
			map.position.y <= cursor.y && cursor.y <= sum.y;
	}

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');
				var context = event.context;
				canvasSize = vec(context.canvas.width, context.canvas.height);

				inventory.size = vec(canvasSize.x, Math.floor(canvasSize.y / 9));
				inventory.position = vec(0, canvasSize.y - inventory.size.y);

				map.size = vec(canvasSize.x, canvasSize.y - inventory.size.y);
				var cellSize = getCellSize(map.size);

				Drawer.drawMap(context, cellSize);

				towers.forEach(Drawer.drawTower.bind(null, context, cellSize));
				enemies.filter(isEnemyAlive)
					.forEach(Drawer.drawEnemy.bind(null, context, cellSize));

				if (blueprint.shown) {
					var color = blueprint.valid ? 'green' : 'red';
					Drawer.drawHighlightedCell(context, cellSize, blueprint.cell, color);
				}

				Drawer.drawInventory(context, inventory.position, inventory.size);
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
							if (isMouseOverMap(event.pos, map)) {
								blueprint.cell = getCellByCoords(canvasSize, event.pos);
								blueprint.valid = isCellFree(blueprint.cell);
								blueprint.shown = true;
							} else {
								blueprint.shown = false;
							}
						}
					}),
					Behavior.type('mousedown')
				);

				if (isMouseOverMap(event.pos, map) && blueprint.valid) {
					behaviorSystem.add(Tower.buildTower(blueprint.cell));
				}
			}
		})
	);
}