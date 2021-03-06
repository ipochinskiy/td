function waitForItemSelected() {
	return Behavior.run(function*() {
		var selectedItem;
		while (!selectedItem) {
			var event = yield Behavior.type('mousedown');
			var clickedItem = ToolsPanel.getHoveredItem(event.pos);

			if (PanelItems.isItemAvailable(clickedItem)) {
				selectedItem = clickedItem;
			}
		}

		if (PanelItems.getItemDescription(selectedItem).type === 'tower') {
			Blueprint.enableModusTower();
		} else {
			Blueprint.enableModusBooster();
		}

		return selectedItem;
	});
}

const shouldShowBlueprint = pos => {
	var tower = Tower.getTowerInCell(Map.getCellByCoords(pos));
	return !(tower && Tower.isFreeForBooster(tower));
}

function makeBlueprintFollowMouse() {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousemove');
			if (!Map.isMouseOver(event.pos)) {
				Blueprint.disable();
			} else {
				Blueprint.enable();
			}

			if (Blueprint.isEnabled()) {
				if (Map.isMouseOver(event.pos)) {
					Blueprint.setCell(event.pos);

					if (shouldShowBlueprint(event.pos)) {
						Blueprint.show();
					} else {
						Blueprint.hide();
					}
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

function applyBoosterOnTower(tower, boostEffect) {
	switch (boostEffect) {
		case 'power': {
			tower.power *= 1.5;
			break;
		}
		case 'cooldown': {
			tower.cooldown /= 1.5;
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
					Money.sub(itemDescription.price);
					itemDescription.price *= 5;
				} else {
					var tower = Tower.getTowerInCell(cell);
					if (!tower) { return; }

					applyBoosterOnTower(tower, itemDescription.boost);
					tower.slots.push(name);
					Money.sub(itemDescription.price);
				}
				return Blueprint.disable();
			}
		}
	});
}

function toolsPanelMainBehavior(behaviorSystem) {
	return Behavior.run(function*() {
		var name = yield waitForItemSelected();

		yield Behavior.first(
			makeBlueprintFollowMouse(),
			waitForItemCancelled(name),
			waitForItemApplied(behaviorSystem, name)
		);
	});
}

