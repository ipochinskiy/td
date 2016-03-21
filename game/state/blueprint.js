var Blueprint = (function(type) {
	var blueprint = {
		cell: vec(0, 0),
		shown: false,
		enabled: false
	};

	const isValid = function() {
		if (blueprint.modus === 'tower') {
			return Map.isCellFree(blueprint.cell);
		} else if (blueprint.modus === 'booster') {
			var tower = Tower.getTowerInCell(blueprint.cell);
			return tower && Tower.isFreeForBooster(tower);
		}
	}

	return {
		isValid: isValid,
		isEnabled: () => blueprint.enabled,

		setCell: (pos) => blueprint.cell = Map.getCellByCoords(pos),

		enableModusTower: () => {
			blueprint.enabled = true;
			blueprint.modus = 'tower';
		},
		enableModusBooster: () => {
			blueprint.enabled = true;
			blueprint.modus = 'booster';
		},
		disable: () => {
			blueprint.shown = false;
			blueprint.enabled = false;
		},

		show: () => blueprint.shown = true,
		hide: () => blueprint.shown = false,

		render: function(context) {
			if (!blueprint.enabled || !blueprint.shown) { return; }

			var cellSize = Map.getCellSize();

			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.4;

			PrimitiveRenderer.rect(context, {
				fill: isValid() ? 'green' : 'red'
			}, vmul(cellSize, blueprint.cell), cellSize);

			context.globalAlpha = oldAlpha;
		},
	}
})();