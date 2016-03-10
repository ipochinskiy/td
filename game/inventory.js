var initInventory = function() {
	const inventoryItemSizeMultiplier = 0.9;

	var inventory = { pos: vec(0, 0), size: vec(0, 0) };

	var content = [
		{
			type: 'button',
			fillsCells: 1,
			cell: { pos: vec(0, 0), size: vec(0, 0) },
			render: function(context, cellPos, cellSize) {
				var style = {
					fill: 'blue',
					stroke: 'solid',
					lineWidth: 2
				};
				var center = vadd(cellPos, vscale(cellSize, 0.5));
				var radius = getBaseItemSize(cellSize).y * 0.5;
				PrimitiveRenderer.circle(context, style, center, radius);
			},
			onClick: function() {
				blueprint.enabled = !blueprint.enabled;
				blueprint.shown = false;
			}
		},
	];


	const getBaseCellSize = (inventorySize) => vdiv(inventorySize, vec(16, 1));
	const getBaseItemSize = (baseCellSize) => vscale(baseCellSize, inventoryItemSizeMultiplier);

	return {
		getHoveredItem: function(pos) {
			if (!isPointInsideRect(pos, inventory)) { return null; }

			for (var i = 0; i < content.length; i++) {
				if (isPointInsideRect(pos, content[i].cell)) { return content[i]; }
			}
		},
		render: function(context, inventoryPos, inventorySize) {
			inventory.pos = vclone(inventoryPos);
			inventory.size = vclone(inventorySize);

			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.6;

			PrimitiveRenderer.rect(context, {
				fill: 'black'
			}, inventory.pos, inventory.size);

			context.globalAlpha = oldAlpha;

			var singleCellSize = getBaseCellSize(inventory.size);
			content.forEach(function(item, index) {
				var indent = singleCellSize.x * index;
				var cellPos = vadd(inventory.pos, vec(indent, 0));
				var cellSize = vmul(singleCellSize, vec(item.fillsCells, 1));
				item.cell = { pos: cellPos, size: cellSize };
				item.render(context, cellPos, cellSize);
			});
		}
	}
}