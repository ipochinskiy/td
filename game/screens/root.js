function isPointInsideRect(point, rect) {
	var sum = vadd(rect.pos, rect.size);
	return rect.pos.x <= point.x && point.x <= sum.x &&
		rect.pos.y <= point.y && point.y <= sum.y;
}

function isPointInCircle(enemy, center, r) {
	var pos = vclone(enemy.currentPosition);
	return Math.sqrt(Math.pow(pos.x - center.x, 2) + Math.pow(pos.y - center.y, 2)) <= r;
}

const getCellCenterCoords = (cell, cellSize) => vmul(cellSize || Map.getCellSize(), vadd(cell, vec(0.5, 0.5)));

var RootScreen = function() {
	var behaviorSystem = BehaviorSystem();

	return Behavior.first(
		Behavior.run(function*() {
			while (true) {
				var event = yield Behavior.type('show');
				var context = event.context;
				var canvasSize = vec(context.canvas.width, context.canvas.height);

				var toolsPanelHeight = canvasSize.y / 9;
				var toolsPanelPositionY = canvasSize.y - toolsPanelHeight;

				var toolsPanelSize = vec(canvasSize.x, toolsPanelHeight);
				var toolsPanelPosition = vec(0, toolsPanelPositionY);
				ToolsPanel.setRect(toolsPanelPosition, toolsPanelSize);
				Map.setSize(vec(canvasSize.x, toolsPanelPositionY));

				Map.render(context);
				ToolsPanel.render(context);

				Tower.renderTowers(context);
				Enemy.renderEnemies(context);

				Blueprint.render(context);

				Money.render(context);
			}
		}),
		function (event) {
			behaviorSystem.update(event);
			return { done: false };
		},
		Behavior.run(function*() {
			behaviorSystem.add(runWavesNonStop(behaviorSystem));

			while(true) {
				yield Behavior.first(
					toolsPanelMainBehavior(behaviorSystem),
					handleTowerHovering()
				);
			}
		})
	);
}