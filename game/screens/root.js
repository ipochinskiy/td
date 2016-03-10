function isMouseOverMap(cursor, map) {
	var sum = vadd(map.position, map.size);
	return map.position.x <= cursor.x && cursor.x <= sum.x &&
		map.position.y <= cursor.y && cursor.y <= sum.y;
}

function isPointInsideRect(point, rect) {
	var sum = vadd(rect.pos, rect.size);
	return rect.pos.x <= point.x && point.x <= sum.x &&
		rect.pos.y <= point.y && point.y <= sum.y;
}

var blueprint = { cell: vec(0, 0), valid: false, shown: false, enabled: false };

var RootScreen = function() {
	var map = { position: vec(0, 0), size: vec(0, 0) };

	var behaviorSystem = BehaviorSystem();

	var Inventory = initInventory();

	var Enemy = initEnemy(behaviorSystem);
	var Tower = initTowers(behaviorSystem);
	var Wave = initWaves(Enemy.spawnEnemy);

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');
				var context = event.context;
				var canvasSize = vec(context.canvas.width, context.canvas.height);

				map.size = vec(canvasSize.x, inventoryPositionY);

				var Drawer = initDrawer(context, getCellSize(map.size));

				Drawer.drawMap();

				towers.forEach(Drawer.drawTower);
				enemies.filter(isEnemyAlive).forEach(Drawer.drawEnemy);

				if (blueprint.enabled && blueprint.shown) {
					var color = blueprint.valid ? 'green' : 'red';
					Drawer.drawHighlightedCell(blueprint.cell, color);
				}

				var inventoryHeight = canvasSize.y / 9;
				var inventoryPositionY = canvasSize.y - inventoryHeight;

				var inventorySize = vec(canvasSize.x, inventoryHeight);
				var inventoryPosition = vec(0, inventoryPositionY);

				Inventory.render(context, inventoryPosition, inventorySize);
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
							if (blueprint.enabled) {
								if (isMouseOverMap(event.pos, map)) {
									blueprint.cell = getCellByCoords(map.size, event.pos);
									blueprint.valid = isCellFree(blueprint.cell);
									blueprint.shown = true;
								} else {
									blueprint.shown = false;
								}
							}
						}
					}),
					Behavior.type('mousedown')
				);

				var item = Inventory.getHoveredItem(event.pos);
				if (item && item.type === 'button') {
					item.onClick();
					console.log('blueprint:', blueprint);
				} else if (isMouseOverMap(event.pos, map) && blueprint.enabled && blueprint.valid) {
					behaviorSystem.add(Tower.buildTower(blueprint.cell));
					blueprint.enabled = false;
				}

			}
		})
	);
}