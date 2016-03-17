function waitForItemSelected() {
	return Behavior.run(function*() {
		var name;
		while (!name) {
			var event = yield Behavior.type('mousedown');
			name = ToolsPanel.getHoveredItem(event.pos);
		}
		PanelItems.start(name);
		return name;
	});
}

function makeBlueprintFollowMouse() {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousemove');
			if (Blueprint.isEnabled()) {
				if (Map.isMouseOver(event.pos)) {
					Blueprint.setCell(event.pos);
					Blueprint.show();
				} else {
					Blueprint.hide();
				}
			}
		}
	})
}

function waitForItemCancelled(name) {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousedown');
			if (ToolsPanel.getHoveredItem(event.pos) === name) {
				return PanelItems.cancel(name);
			}
		}
	});
}

function waitForItemApplied(behaviorSystem, name) {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousedown');
			if (Map.isMouseOver(event.pos) && Blueprint.isValid()) {
				var cell = Map.getCellByCoords(event.pos);
				var towerBehavior = buildTower(behaviorSystem, cell);
				behaviorSystem.add(towerBehavior);
				return PanelItems.apply(name);
			}
		}
	});
}

function waitForItemDropped(behaviorSystem, name) {
	return Behavior.first(
		makeBlueprintFollowMouse(),
		waitForItemCancelled(name),
		waitForItemApplied(behaviorSystem, name)
	);
}

