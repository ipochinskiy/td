var PanelItems = (function() {
	const panelItemSizeMultiplier = 0.9;

	const items = {
		addTowerButton: {
			description: { type: 'tower' },
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
		},
		powerBooster: {
			description: { type: 'booster', boost: 'power' },
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
		},
		cooldownBooster: {
			description: { type: 'booster', boost: 'cooldown' },
			render: function(context, rect) {
				var style = {
					fill: 'magenta',
					stroke: 'solid',
					lineWidth: 5
				};
				var center = vadd(rect.pos, vscale(rect.size, 0.5));
				var radius = rect.size.y * panelItemSizeMultiplier * 0.5;
				PrimitiveRenderer.circle(context, style, center, radius);
			},
		},
	};

	return {
		getItemDescription: name => items[name] && items[name].description || {},
		render: (context, name, rect) => {
			if (items[name]) {
				items[name].render(context, rect);
			}
		},
	};
})();