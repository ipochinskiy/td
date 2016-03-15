var ToolsPanel = (function() {
	const getBaseCellSize = (panelSize) => vdiv(panelSize, vec(16, 1));

	var panel = {
		pos: vec(0, 0),
		size: vec(0, 0),
		content: [ 'addTowerButton' ]
	};

	const getRect = (pos, size) => ({
		pos: pos || vec(0, 0),
		size: size || vec(0, 0)
	});

	const getItemRect = (name, cellSize) => {
		var index = panel.content.indexOf(name);
		if (index === -1) { return getRect(); }

		cellSize = cellSize || getBaseCellSize(panel.size);
		var indent = cellSize.x * index;

		return getRect(vadd(panel.pos, vec(indent, 0)), cellSize);
	}

	return {
		getHoveredItem: function(pos) {
			if (!isPointInsideRect(pos, panel)) { return null; }

			for (var i = 0; i < panel.content.length; i++) {
				var name = panel.content[i];
				var rect = getItemRect(name);
				if (isPointInsideRect(pos, rect)) {
					return name;
				}
			}

			return null;
		},
		render: function(context, panelPos, panelSize) {
			panel.pos = vclone(panelPos);
			panel.size = vclone(panelSize);

			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.6;

			PrimitiveRenderer.rect(context, {
				fill: 'black'
			}, panel.pos, panel.size);

			context.globalAlpha = oldAlpha;

			var singleCellSize = getBaseCellSize(panel.size);
			panel.content.forEach(name => {
				var rect = getItemRect(name, singleCellSize);
				PanelItems.render(context, name, rect);
			});
		}
	}
})();