var StringRenderer = (function() {
	return {
		render: function(context, string, style, pos) {
			context.fillStyle = style.fill;
			context.font = style.height + 'px ' + style.font;
			context.textAlign = style.halign || 'left';
			context.textBaseline = style.valign || 'top';

			context.fillText(string, pos.x, pos.y);
		},
		getWidth: function(context, string, height, fontName) {
			context.font = height + 'px ' + fontName;
			return context.measureText(string).width;
		}
	};
})();
