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

function makeBlueprint() {
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
				return { pos: event.pos, cancel: true };
			}
		}
	});
}

function waitForItemApplied() {
	return Behavior.run(function*() {
		while (true) {
			var event = yield Behavior.type('mousedown');
			if (Map.isMouseOver(event.pos) && Blueprint.isValid()) {
				return { pos: event.pos, apply: true };
			}
		}
	});
}

function waitForItemDropped(name) {
	return Behavior.first(
		makeBlueprint(),
		waitForItemCancelled(name),
		waitForItemApplied()
	);
}

