var enemies = [];

function getDefaultEnemy() {
	return {
		hp: 10,
		speed: 1,
		currentPosition: vec(-1, 1),
		previousPosition: vec(-1, 1),
		bullets: []
	};
}

function isStepBack(enemy, step) {
	return veq(enemy.previousPosition, step);
}

function getNextStep(enemy) {
	return Map.getNearbyCells(enemy.currentPosition).filter(function(cell) {
		return Map.isCellPath(cell) && !isStepBack(enemy, cell);
	})[0];
}

function isEnemyAlive(enemy) {
	return enemy.hp > 0;
}

function getEnemiesInCircle(pos, r) {
	return enemies.filter(enemy => isEnemyAlive(enemy) && isPointInCircle(enemy, pos, r));
}

var initEnemy = function(behaviorSystem) {
	function goToTheCastle(enemy) {
		return Behavior.run(function*() {
			while (isEnemyAlive(enemy)) {
				var nextStep = getNextStep(enemy);

				if (nextStep) {
					var startPosition = vclone(enemy.currentPosition);
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

	return {
		spawnEnemy: function() {
			var enemy = getDefaultEnemy();
			enemies.push(enemy);
			behaviorSystem.add(goToTheCastle(enemy));
		}
	}
}
