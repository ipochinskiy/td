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

function waitForItemCancelled(item, map) {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousedown');
			if (ToolsPanel.getHoveredItem(event.pos) === item) {
				return { pos: event.pos, cancel: true };
			}
		}
	});
}

function waitForItemApplied(map) {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousedown');
			if (isPointInsideRect(event.pos, map) && Blueprint.isValid()) {
				return { pos: event.pos, apply: true };
			}
		}
	});
}

function waitForItemDropped(item, map) {
	return Behavior.first(
		makeBlueprint(map),
		waitForItemCancelled(item, map),
		waitForItemApplied(map)
	);
}

