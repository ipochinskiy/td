var waves = [
	{ enemiesCount: 2, delay: 1, name: 'first' },
	// { enemiesCount: 5, delay: 5, name: 'second' },
	// { enemiesCount: 10, delay: 5, name: 'third' },
	// { enemiesCount: 15, delay: 8, name: 'fourth' },
];

var initWaves = function(spawnEnemy) {
	return {
		spawnWave: function() {
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
	}
}