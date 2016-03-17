var PanelItems = (function() {
	const panelItemSizeMultiplier = 0.9;

	const items = {
		addTowerButton: {
			render: function(context, rect) {
				var style = {
					fill: 'blue',
					stroke: 'solid',
					lineWidth: 2
				};
				var center = vadd(rect.pos, vscale(rect.size, 0.5));
				var radius = rect.size.y * panelItemSizeMultiplier * 0.5;
				PrimitiveRenderer.circle(context, style, center, radius);
			},
			start: () => Blueprint.enableModusTower(),
			cancel: () => Blueprint.disable(),
			apply: () => {
				Blueprint.hide();
				Blueprint.disable();
			}
		},
		powerBooster: {
			render: function(context, rect) {
				var style = {
					fill: 'orange',
					stroke: 'solid',
					lineWidth: 5
				};
				var center = vadd(rect.pos, vscale(rect.size, 0.5));
				var radius = rect.size.y * panelItemSizeMultiplier * 0.5;
				PrimitiveRenderer.circle(context, style, center, radius);
			},
			start: () => Blueprint.enableModusBooster(),
			cancel: () => Blueprint.disable(),
			apply: () => {
				Blueprint.hide();
				Blueprint.disable();
			}
		},
	};

	var activeItem;

	return {
		start: name => {
			if (items[name]) {
				activeItem = name;
				items[name].start();
			}
		},
		apply: name => {
			if (items[name]) {
				activeItem = undefined;
				items[name].apply();
			}
		},
		cancel: name => {
			if (items[name]) {
				activeItem = undefined;
				items[name].cancel();
			}
		},
		render: (context, name, rect) => {
			if (items[name]) {
				items[name].render(context, rect);
			}
		},
	};
})();