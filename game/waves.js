var initWaves = function(spawnEnemy) {
	var waves = [
		{ enemiesCount: 2, delay: 1 },
		{ enemiesCount: 5, delay: 5 },
		{ enemiesCount: 10, delay: 8 },
		{ enemiesCount: 20, delay: 15 },
	];

	return {
		spawnWave: function() {
			return Behavior.run(function*() {
				for (var i = 0; i < waves.length; i++) {
					var wave = waves[i];
					if (wave.delay > 0) {
						yield Behavior.wait(wave.delay);
					}

					for (var j = 0; j < wave.enemiesCount; j++) {
						if (j > 0) {
							yield Behavior.wait(1);
						}
						spawnEnemy();
					}
				};
			});
		}
	}
}