var initInventory = function() {
	var position = vec(0, 0);
	var size = vec(0, 0);

	var inventory = [
		{
			type: 'button',
			pos: vadd(position, vec()),
			size: vec(),
			render: function(context) {},
			onClick: function() {
				blueprint.enabled = !blueprint.enabled;
			}
		},
	];

	return {
		setPosition: function(x, y) {
			position = vec(x, y);
		},
		setSize: function(x, y) {
			size = vec(x, y);
		},
		isMouseOver: function(pos) {
			return isPointInsideRect(pos, { pos: position, size: size });
		},
		getItem: function(pos) {
			if (!isPointInsideRect(pos, { pos: position, size: size })) {
				return null;
			}


		},
		render: function(context) {
			var oldAlpha = context.globalAlpha;
			context.globalAlpha = 0.6;

			PrimitiveRenderer.rect(context, {
				fill: 'black'
			}, position, size);

			context.globalAlpha = oldAlpha;
		}
	}
}