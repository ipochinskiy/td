var towers = [];

var initTowers = function(behaviorSystem) {
	function getDefaultTower(x, y) {
		return {
			x: x,
			y: y,
			range: 2,
			cooldown: 0.8,
			currentTimeout: 0
		};
	}

	function waitForTarget(tower) {
		return Behavior.update(function() {
			var enemies = getEnemiesInCircle(vclone(tower), tower.range);

			if (enemies.length > 0) {
				return enemies[0];
			} 
		});
	}

	function shoot(tower, target) {
		return Behavior.parallel(
			Behavior.wait(tower.cooldown),
			Behavior.run(function*() {
				var startPosition = vclone(tower);
				var bullet = { position: startPosition };
				target.bullets.push(bullet);

				yield Behavior.interval(0.2, function(progress) {
					bullet.position = vlerp(startPosition, target.currentPosition, progress);
				});

				target.hp--;
				var index = target.bullets.indexOf(bullet);
				target.bullets.splice(index, 1);
			})
		);
	}

	function targetAvailable(tower, target) {
		return isEnemyInCircle(target, vclone(tower), tower.range) && isEnemyAlive(target);
	}

	return {
		buildTower: function(cell) {
			var tower = getDefaultTower(cell.x, cell.y);

			towers.push(tower);
			setCellContent(cell, 'T');

			return Behavior.run(function* () {
				while(true) {
					var target = yield waitForTarget(tower);
					while (targetAvailable(tower, target)) {
						yield shoot(tower, target);
					}
				}
			});
		}
	};
}
