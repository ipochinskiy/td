function isMouseOverMap(cursor, map) {
	var sum = vadd(map.position, map.size);
	return map.position.x <= cursor.x && cursor.x <= sum.x &&
		map.position.y <= cursor.y && cursor.y <= sum.y;
}

var RootScreen = function() {
	var blueprint = { cell: vec(0, 0), valid: false, shown: false };

	var inventory = { position: vec(0, 0), size: vec(0, 0) };
	var map = { position: vec(0, 0), size: vec(0, 0) };

	var canvasSize = vec(0, 0);

	var behaviorSystem = BehaviorSystem();

	var Enemy = initEnemy(behaviorSystem);
	var Tower = initTowers(behaviorSystem);
	var Wave = initWaves(Enemy.spawnEnemy);

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');
				var context = event.context;
				canvasSize = vec(context.canvas.width, context.canvas.height);

				inventory.size = vec(canvasSize.x, canvasSize.y / 9);
				inventory.position = vec(0, canvasSize.y - inventory.size.y);

				map.size = vec(canvasSize.x, canvasSize.y - inventory.size.y);

				var Drawer = initDrawer(getCellSize(map.size));

				Drawer.drawMap(context);

				towers.forEach(Drawer.drawTower.bind(null, context));
				enemies.filter(isEnemyAlive)
					.forEach(Drawer.drawEnemy.bind(null, context));

				if (blueprint.shown) {
					var color = blueprint.valid ? 'green' : 'red';
					Drawer.drawHighlightedCell(context, blueprint.cell, color);
				}

				Drawer.drawInventory(context, inventory);
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
								blueprint.cell = getCellByCoords(map.size, event.pos);
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