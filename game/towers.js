var towers = [];

var initTowers = function(behaviorSystem) {
	function getDefaultTower(cell) {
		return {
			position: vclone(cell),
			power: 1.5,
			range: 1.5,
			cooldown: 0.8,
			currentTimeout: 0
		};
	}

	function waitForTarget(tower) {
		return Behavior.update(function() {
			var enemies = getEnemiesInCircle(vclone(tower.position), tower.range);

			if (enemies.length > 0) {
				return enemies[0];
			} 
		});
	}

	function moveToTargetAndMakeDamage(tower, target, bullet) {
		var startPosition = vclone(tower.position);
		return Behavior.run(function*() {
			yield Behavior.interval(0.2, function(progress) {
				bullet.position = vlerp(startPosition, target.currentPosition, progress);
			});

			target.hp -= tower.power;

			var index = target.bullets.indexOf(bullet);
			target.bullets.splice(index, 1);
		});
	}

	function spawnBullet(tower, target) {
		var startPosition = vclone(tower.position);
		var bullet = { position: startPosition };
		target.bullets.push(bullet);

		behaviorSystem.add(moveToTargetAndMakeDamage(tower, target, bullet));
	}

	function shoot(tower, target) {
		spawnBullet(tower, target);
		return Behavior.wait(tower.cooldown);
	}

	function targetAvailable(tower, target) {
		return isEnemyInCircle(target, vclone(tower.position), tower.range) && isEnemyAlive(target);
	}

	return {
		buildTower: function(cell) {
			var tower = getDefaultTower(cell);

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
