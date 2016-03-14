const inventoryItemSizeMultiplier = 0.9;

const getBaseCellSize = (inventorySize) => vdiv(inventorySize, vec(16, 1));
const getBaseItemSize = (baseCellSize) => vscale(baseCellSize, inventoryItemSizeMultiplier);

var itemsMap = {
	addTowerButton: {
		render: function(context, item) {
			var style = {
				fill: 'blue',
				stroke: 'solid',
				lineWidth: 2
			};
			var center = vadd(item.pos, vscale(item.size, 0.5));
			var radius = getBaseItemSize(item.size).y * 0.5;
			PrimitiveRenderer.circle(context, style, center, radius);
		},
		onClick: function() {
			//	TODO: made blueprint blackbox
			blueprint.enabled = !blueprint.enabled;
			blueprint.shown = false;
		}
	}
};

var initInventory = function() {
	var inventory = {
		pos: vec(0, 0),
		size: vec(0, 0),
		content: [
			{
				type: 'addTowerButton',
				pos: vec(0, 0),
				size: vec(0, 0)
			},
		]
	};

	return {
		getHoveredItem: function(pos) {
			if (!isPointInsideRect(pos, inventory)) { return null; }

			for (var i = 0; i < inventory.content.length; i++) {
				var rect = {
					pos: inventory.content[i].pos,
					size: inventory.content[i].size
				};
				if (isPointInsideRect(pos, rect)) {
					var type = inventory.content[i].type;
					return itemsMap[type];
				}
			}

			return null;
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
			inventory.content.forEach(function(item, index) {
				var indent = singleCellSize.x * index;

				item.pos = vadd(inventory.pos, vec(indent, 0));
				item.size = singleCellSize;

				var type = inventory.content[index].type;
				itemsMap[type].render(context, item);
			});
		}
	}
}