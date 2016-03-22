var PanelItems = (function() {
	const panelItemSizeMultiplier = 0.9;

	const items = {
		addTowerButton: { type: 'tower', price: MONEY_TOWER_COST },
		powerBooster: { type: 'booster', boost: 'power', price: MONEY_BOOSTER_POWER_COST },
		cooldownBooster: { type: 'booster', boost: 'cooldown', price: MONEY_BOOSTER_COOLDOWN_COST },
	};

	const renderPrice = (context, name, rect) => {
		var text = '$' + items[name].price;

		var style = {
			fill: 'cornsilk',
			height: 24,
			font: 'Arial',
			halign: 'right',
			valign: 'bottom'
		};

		StringRenderer.render(context, text, style, vadd(rect.pos, rect.size));
	}

	const renderItem = (context, name, rect) => {
		var center = vadd(rect.pos, vscale(rect.size, 0.5));
		var radius = rect.size.y * panelItemSizeMultiplier * 0.5;
		PrimitiveRenderer.circle(context, PANEL_ITEMS_STYLE_MAP[name], center, radius);
	}

	return {
		getItemDescription: name => items[name] && items[name] || {},
		render: (context, name, rect) => {
			if (!items[name]) { return; }

			renderItem(context, name, rect);
			renderPrice(context, name, rect);
			}
		},
	};
})();