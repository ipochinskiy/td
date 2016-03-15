function waitForItemSelected() {
	return Behavior.run(function*() {
		var item;
		while (!item) {
			var event = yield Behavior.type('mousedown');
			item = ToolsPanel.getHoveredItem(event.pos);
		}
		return item;
	});
}

function makeBlueprint(map) {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousemove');
			if (Blueprint.isEnabled()) {
				if (isPointInsideRect(event.pos, map)) {
					Blueprint.setCell(map.size, event.pos);
					Blueprint.show();
				} else {
					Blueprint.hide();
				}
			}
		}
	})
}

function waitForItemDropped(item, map) {
	return Behavior.first(
		makeBlueprint(map),
		Behavior.run(function*() {
			var event = yield Behavior.type('mousedown');
			return event;
			// if (Blueprint.isEnabled()) {
			// 	if (isPointInsideRect(event.pos, map)) {
			// 		return event
			// 		var cell = getCellByCoords(map.size, event.pos);
			// 		behaviorSystem.add(addTower(cell));
			// 	} else if () {
			// 		Blueprint.disable();
			// 	}
			// }
		})
	);
}

