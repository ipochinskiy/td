function waitForTarget(tower) {
	return Behavior.update(function() {
		var enemies = Enemy.getEnemiesInCircle(tower.pos, tower.range);

		if (enemies.length > 0) {
			return enemies[0];
		} 
	});
}

function moveToTargetAndMakeDamage(tower, target, bullet) {
	var startPosition = vclone(tower.pos);
	return Behavior.run(function*() {
		yield Behavior.interval(0.2, function(progress) {
			bullet.pos = vlerp(startPosition, target.currentPosition, progress);
		});

		target.hp -= tower.power;

		var index = target.bullets.indexOf(bullet);
		target.bullets.splice(index, 1);
	});
}

function spawnBullet(tower, target) {
	var bullet = {};
	target.bullets.push(bullet);

	return moveToTargetAndMakeDamage(tower, target, bullet);
}

function shoot(behaviorSystem, tower, target) {
	var bulletBehavior = spawnBullet(tower, target);
	behaviorSystem.add(bulletBehavior);
	return Behavior.wait(tower.cooldown);
}

function buildTower(behaviorSystem, cell) {
	var tower = Tower.getDefaultTower(cell);

	towers.push(tower);
	Map.setCellContent(cell, 'T');

	return Behavior.run(function*() {
		while (true) {
			var target = yield waitForTarget(tower);
			while (Tower.isTargetAvailable(tower, target)) {
				yield shoot(behaviorSystem, tower, target);
			}
		}
	});
}

