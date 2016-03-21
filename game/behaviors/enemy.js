function goToTheCastle(enemy) {
	return Behavior.run(function*() {
		while (Enemy.isEnemyAlive(enemy)) {
			var nextStep = Enemy.getNextStep(enemy);

			if (nextStep) {
				var startPosition = enemy.currentPosition;
				yield Behavior.interval(enemy.speed, function(progress) {
					enemy.currentPosition = vlerp(startPosition, nextStep, progress);
				});
				enemy.previousPosition = startPosition;
			} else {
				// near the castle
				enemy.hp = 0;
			}
		}
	});
}

function spawnEnemy(behaviorSystem) {
	var enemy = Enemy.getDefaultEnemy();
	enemies.push(enemy);
	return goToTheCastle(enemy);
}

function runWaves(behaviorSystem) {
	return Behavior.run(function*() {
		for (var i = 0; i < waves.length; i++) {
			var wave = waves[i];
			if (wave.delay > 0) {
				yield Behavior.wait(wave.delay);
			}

			for (var j = 0; j < wave.enemiesCount; j++) {
				if (j > 0) {
					yield Behavior.wait(ENEMY_SPAWN_DELAY);
				}

				behaviorSystem.add(spawnEnemy());
			}
		};
	});
}
