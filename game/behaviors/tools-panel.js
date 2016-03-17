function waitForItemSelected() {
	return Behavior.run(function*() {
		var name;
		while (!name) {
			var event = yield Behavior.type('mousedown');
			name = ToolsPanel.getHoveredItem(event.pos);
		}

		if (PanelItems.getItemDescription(name).type === 'tower') {
			Blueprint.enableModusTower();
		} else {
			Blueprint.enableModusBooster();
		}

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
				return Blueprint.disable();
			}
		}
	});
}

function applyBoosterOnCell(cell, boostEffect) {
	var tower = Tower.getTowerInCell(cell);
	if (!tower) { return; }

	switch (boostEffect) {
		case 'power': {
			tower.power *= 2;
			break;
		}
		case 'cooldown': {
			tower.cooldown /= 2;
			break;
		}
	}
}

function waitForItemApplied(behaviorSystem, name) {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousedown');

			if (Map.isMouseOver(event.pos) && Blueprint.isValid()) {
				var cell = Map.getCellByCoords(event.pos);
				var itemDescription = PanelItems.getItemDescription(name);

				if (itemDescription.type === 'tower') {
					var towerBehavior = buildTower(behaviorSystem, cell);
					behaviorSystem.add(towerBehavior);
				} else {
					applyBoosterOnCell(cell, itemDescription.boost);
				}
				return Blueprint.disable();
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

