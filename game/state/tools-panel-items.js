var PanelItems = (function() {
	const panelItemSizeMultiplier = 0.9;

	const items = {
		addTowerButton: { type: 'tower' },
		powerBooster: { type: 'booster', boost: 'power' },
		cooldownBooster: { type: 'booster', boost: 'cooldown' },
	};

	return {
		getItemDescription: name => items[name] && items[name] || {},
		render: (context, name, rect) => {
			if (items[name]) {
				var center = vadd(rect.pos, vscale(rect.size, 0.5));
				var radius = rect.size.y * panelItemSizeMultiplier * 0.5;
				PrimitiveRenderer.circle(context, PANEL_ITEMS_STYLE_MAP[name], center, radius);
			}
		},
	};
})();