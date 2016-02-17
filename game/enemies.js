var enemies = [];

function getDefaultEnemy() {
	return {
		hp: 7,
		speed: 0.7,
		currentPosition: vec(4, -1),
		previousPosition: vec(4, -1),
		bullets: []
	};
}

function isStepBack(enemy, step) {
	return veq(enemy.previousPosition, step);
}

function getNextStep(enemy) {
	return getNearbyCells(enemy.currentPosition).filter(function(cell) {
		return isCellOccupiable(cell) && !isStepBack(enemy, cell);
	})[0];
}

function isEnemyAlive(enemy) {
	return enemy.hp > 0;
}

function isEnemyInCircle(enemy, center, r) {
	var pos = vclone(enemy.currentPosition);
	return Math.sqrt(Math.pow(pos.x - center.x, 2) + Math.pow(pos.y - center.y, 2)) <= r;
}

function getEnemiesInCircle(pos, r) {
	return enemies.filter(enemy => isEnemyAlive(enemy) && isEnemyInCircle(enemy, pos, r));
}

var initEnemy = function(behaviorSystem) {
	return {
		spawnEnemy: function() {
			var enemy = getDefaultEnemy();
			enemies.push(enemy);

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
						enemy.hp = 0;
					}
				}
			});
		}
	}
}
