const panelItemSizeMultiplier = 0.9;

var itemsMap = {
	addTowerButton: {
		pos: vec(0, 0),
		size: vec(0, 0),
		render: function(context, pos, size) {
			var style = {
				fill: 'blue',
				stroke: 'solid',
				lineWidth: 2
			};
			var center = vadd(pos, vscale(size, 0.5));
			var radius = size.y * panelItemSizeMultiplier * 0.5;
			PrimitiveRenderer.circle(context, style, center, radius);
		},
		onClick: () => Blueprint.enable(),
		onCancel: () => Blueprint.disable(),
		apply: () => Blueprint.disable() || Blueprint.hide()
	}
};

var ToolsPanel = (function() {
	const getBaseCellSize = (panelSize) => vdiv(panelSize, vec(16, 1));

	var panel = {
		pos: vec(0, 0),
		size: vec(0, 0),
		content: [ 'addTowerButton' ]
	};

	return {
		getHoveredItem: function(pos) {
			if (!isPointInsideRect(pos, panel)) { return null; }

			for (var i = 0; i < panel.content.length; i++) {
				var name = panel.content[i];
				var item = itemsMap[name];

				if (isPointInsideRect(pos, item)) {
					return item;
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
			panel.content.forEach(function(name, index) {
				var item = itemsMap[name];

				var indent = singleCellSize.x * index;
				item.pos = vadd(panel.pos, vec(indent, 0));
				item.size = singleCellSize;

				item.render(context, item.pos, item.size);
			});
		}
	}
})();