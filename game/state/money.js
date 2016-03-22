var Money = (function() {
	var money = MONEY_DEFAULT_SUM;
	return {
		add: amount => money += amount,
		sub: amount => money -= amount,

		getRest: () => money,

		render: function(context) {
			StringRenderer.render(context, '$ ' + money, {
				fill: 'red',
				height: 22,
				font: 'Arial',
				halign: 'right',
				valign: 'bottom'
			}, vec(context.canvas.width - 20, 40));
		}
	};
})();

