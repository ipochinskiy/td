var Money = (function() {
	var money = MONEY_DEFAULT_SUM;
	return {
		add: amount => money += amount,
		sub: amount => money -= amount,

		getRest: () => money,

		render: function(context) {
			var canvasSize = vec(context.canvas.width, context.canvas.height);

			var text = '$ ' + money;
			var textWidth = StringRenderer.getWidth(context, text, 22, 'Arial');

			StringRenderer.render(context, text, {
				fill: 'red',
				height: 22,
				font: 'Arial',
				halign: 'left',
				valign: 'bottom'
			}, vec(canvasSize.x - textWidth - 20, 50));
		}
	};
})();

