var towers = [];

var Tower = (function() {
	const slotRadiusMultiplier = 0.05;
	const slotTowerGap = slotRadiusMultiplier * 3;

	const towerRadiusMultiplier = 0.45;
	const getTowerRadius = cellSize => cellSize.x * towerRadiusMultiplier;

	var hoveredTower;

	const getSlotStyle = name => {
		if (name === 'powerBooster') {
			return STYLE_POWER_BOOSTER_ITEM;
		} else if (name === 'cooldownBooster') {
			return STYLE_COOLDOWN_BOOSTER_ITEM;
		}
	};

	const getSlotCenter = (cell, cellSize, slotName, slotIndex) => {
		const getCenterCoords = coords => vmul(cellSize, vadd(coords, vec(0.5, 0.5)));
		const slotCellCenterDistance = 0.35;

		switch (slotIndex) {
			case 0: return getCenterCoords(vsub(cell, vec(0, slotCellCenterDistance)));
			case 1: return getCenterCoords(vadd(cell, vec(slotCellCenterDistance, 0)));
			case 2: return getCenterCoords(vadd(cell, vec(0, slotCellCenterDistance)));
			case 3: return getCenterCoords(vsub(cell, vec(slotCellCenterDistance, 0)));
			default: return 0;
		}
	}

	const renderRange = (context, center, radius) => {
		var oldAlpha = context.globalAlpha;
		context.globalAlpha = 0.1;
		PrimitiveRenderer.circle(context, STYLE_TOWER_RANGE, center, radius);
		context.globalAlpha = oldAlpha;
	}

	const renderTower = (context, cellSize, tower) => {
		var towerCenter = getCellCenterCoords(tower.pos, cellSize);
		PrimitiveRenderer.circle(context, STYLE_TOWER, towerCenter, getTowerRadius(cellSize));

		if (hoveredTower && veq(hoveredTower.pos, tower.pos)) {
			renderRange(context, towerCenter, cellSize.x * tower.range);
		}

		var slotsCoordY = towerCenter.y - slotTowerGap;

		for (var i = 0; i < tower.maxSlotsAmount; i++) {
			var name = tower.slots[i] || '';
			var style = PANEL_ITEMS_STYLE_MAP[name];
			var center = getSlotCenter(tower.pos, cellSize, name, i);
			var radius = cellSize.x * slotRadiusMultiplier;

			PrimitiveRenderer.circle(context, style, center, radius);
		}
	}

	return {
		getDefaultTower: cell => ({
			pos: vclone(cell),
			power: 5,
			range: 1.5,
			cooldown: 1.5,
			maxSlotsAmount: TOWER_MAX_SLOT_COUNT,
			slots: []
		}),
		getTowerInCell: cell => towers.filter(tower => veq(tower.pos, cell))[0],

		setHovered: tower => hoveredTower = tower,
		unsetHovered: () => hoveredTower = undefined,

		isTargetAvailable: (tower, target) =>
			isPointInCircle(target, tower.pos, tower.range) && Enemy.isEnemyAlive(target),
		isFreeForBooster: tower => tower.slots.length < tower.maxSlotsAmount,

		renderTowers: function(context) {
			var cellSize = Map.getCellSize();
			towers.forEach(renderTower.bind(null, context, cellSize));
		},
	};
})();
