var enemies = [];

var waves = [
	{ enemiesCount: 2, delay: 1, name: 'first' },
	// { enemiesCount: 5, delay: 5, name: 'second' },
	// { enemiesCount: 10, delay: 5, name: 'third' },
	// { enemiesCount: 15, delay: 8, name: 'fourth' },
];

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

function isCellOccupiable(cell) {
	var content = getCellContent(cell);
	return content === MAP_SYMBOL_PATH || content === MAP_SYMBOL_START;
}

function getNextStep(enemy) {
	return getNearbyCells(enemy.currentPosition).filter(function(cell) {
		return isCellOccupiable(cell) && !isStepBack(enemy, cell);
	})[0];
}

function spawnEnemy() {
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

function spawnWave() {
	return Behavior.run(function*() {
		for (var i = 0; i < waves.length; i++) {
			var wave = waves[i];
			console.log('wave.name:', wave.name);
			if (wave.delay > 0) {
				console.log('wait for a wave to start:', wave.delay)
				yield Behavior.wait(wave.delay);
			}

			console.log('starting to spawn');

			for (var j = 0; j < wave.enemiesCount; j++) {
				console.log('enemy', j);
				if (j > 0) {
					yield Behavior.wait(1);
				}
				yield spawnEnemy();
			}
		};
		console.log('bestanden');
	});
}

function isEnemyInCircle(circle, enemy) {
	var x = enemy.currentPosition.x;
	var y = enemy.currentPosition.y;

	return Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)) <= circle.r;
}

function isEnemyAlive(enemy) {
	return enemy.hp > 0;
}

function getEnemiesInCircle(circle) {
	return enemies.filter(enemy => isEnemyAlive(enemy) && isEnemyInCircle(circle, enemy));
}

