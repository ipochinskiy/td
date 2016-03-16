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
	behaviorSystem.add(goToTheCastle(enemy));
}
