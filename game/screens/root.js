function isPointInsideRect(point, rect) {
	var sum = vadd(rect.pos, rect.size);
	return rect.pos.x <= point.x && point.x <= sum.x &&
		rect.pos.y <= point.y && point.y <= sum.y;
}

function isPointInCircle(enemy, center, r) {
	var pos = vclone(enemy.currentPosition);
	return Math.sqrt(Math.pow(pos.x - center.x, 2) + Math.pow(pos.y - center.y, 2)) <= r;
}

const getCellCenterCoords = cell => vmul(Map.getCellSize(), vadd(cell, vec(0.5, 0.5)));

var towers = [];

var RootScreen = function() {
	var behaviorSystem = BehaviorSystem();

	var Enemy = initEnemy(behaviorSystem);
	var Wave = initWaves(Enemy.spawnEnemy);

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');
				var context = event.context;
				var canvasSize = vec(context.canvas.width, context.canvas.height);

				var toolsPanelHeight = canvasSize.y / 9;
				var toolsPanelPositionY = canvasSize.y - toolsPanelHeight;

				Map.setSize(vec(canvasSize.x, toolsPanelPositionY));

				var Drawer = initDrawer(context, Map.getCellSize());

				Map.render(context);

				towers.forEach(Tower.render.bind(null, context));
				enemies.filter(isEnemyAlive).forEach(Drawer.drawEnemy);

				Blueprint.render(context);

				var toolsPanelSize = vec(canvasSize.x, toolsPanelHeight);
				var toolsPanelPosition = vec(0, toolsPanelPositionY);
				ToolsPanel.setRect(toolsPanelPosition, toolsPanelSize);

				ToolsPanel.render(context);
			}
		}),
		function (event) {
			behaviorSystem.update(event);
			return { done: false };
		},
		Behavior.run(function*() {
			behaviorSystem.add(Wave.spawnWave());

			while(true) {
				var name = yield waitForItemSelected();
				PanelItems.start(name);

				var action = yield waitForItemDropped(name);
				if (action.cancel) {
					PanelItems.cancel(name);
				} else if (action.apply) {
					var cell = Map.getCellByCoords(action.pos);
					var towerBehavior = buildTower(behaviorSystem, cell);
					behaviorSystem.add(towerBehavior);
					PanelItems.apply(name);
				}
			}
		})
	);
}