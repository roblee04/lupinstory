import Phaser from 'phaser'
import SceneKeys from '../const/scenekeys'
import TextureKeys from '../const/texturekeys';
import AnimationKeys from '../const/animationkeys';
import Player from '../game/player'
import Monkey from '../game/monkey'
// import Projectile from '../game/projectile'

export default class LupinStory extends Phaser.Scene {
	private player!: Player
	constructor() {
		super('game')
	}


	create() {
		// background
		this.add.image(400, 300, TextureKeys.Background);

		// platforms
		const platforms = this.physics.add.staticGroup();
		platforms.create(400, 568, TextureKeys.Ground).setScale(2).refreshBody();

		platforms.create(600, 400, TextureKeys.Ground);
		platforms.create(50, 250, TextureKeys.Ground);
		platforms.create(750, 220, TextureKeys.Ground);

		this.player = new Player(this) 
		this.add.existing(this.player)
		this.physics.add.existing(this.player.lupin, true)
		this.physics.add.collider(this.player.lupin, platforms);

		// create enemies
		var enemies = this.physics.add.group({
			classType: Monkey
		});
	 
		// var enemy = enemies.create(300, 300, TextureKeys.Lupin); // Adjust x, y as needed
		// this.physics.add.existing(enemy, true);
		// this.physics.add.collider(enemy, platforms);
		
		const numEnemies = 10; // Adjust the number of enemies as needed

		for (let i = 0; i < numEnemies; i++) {
			const platform = Phaser.Utils.Array.GetRandom(platforms.getChildren());
	 
			// Calculate the bounds for the enemy spawn
			const minX = Math.max(platform.x - platform.displayWidth / 2, 0);
			const maxX = Math.min(platform.x + platform.displayWidth / 2, 800);
			const minY = Math.max(platform.y - platform.displayHeight / 2, 0);
			const maxY = Math.min(platform.y + platform.displayHeight / 2, 600);
	 
			// Generate random positions for enemies within the bounds
			const x = Phaser.Math.Between(minX, maxX);
			const y = Phaser.Math.Between(minY, maxY) - 70;
	 
			var enemy = enemies.create(x, y, TextureKeys.Lupin);
			enemy.setCollideWorldBounds(true)
			this.physics.add.existing(enemy, true);
			enemy.body.setSize(50, 55);
			this.physics.add.collider(enemy, platforms);

			//enemy interactions
			
		}


		// Add collision between player and enemies in the group
        this.physics.add.overlap(this.player.lupin, enemies, this.handlePlayerEnemyCollision, undefined, this);

		
		// projectiles
		this.physics.add.overlap(this.player.projectileGroup, enemies, this.handleProjEnemyCollision, undefined, this)


	}

	update(time: number, delta: number): void {
		// console.log(time)
	}

	handlePlayerEnemyCollision(this: Phaser.Scene, p : Phaser.GameObjects.GameObject, e : Phaser.GameObjects.GameObject) {
		// Handle collision logic
		// You can add health reduction, player damage, etc.
		const enemy = e as Monkey
		enemy.alive = false;
		enemy.body.enable = false;
		// add tween
		this.tweens.add({
			targets: enemy,
			alpha: 0,           // Target alpha (opacity)
			duration: 1000,     // Duration of the tween in milliseconds (adjust as needed)
			onComplete: () => {
				// Once the tween is complete, set the enemy to inactive and destroy it
				// this.enemyGroup.killAndHide(enemy) 
				enemy.destroy();
				// enemy.disableBody(true, true);
			}
		});
			
		
	}
	handleProjEnemyCollision(this: Phaser.Scene, pg : Phaser.GameObjects.GameObject, e : Phaser.GameObjects.GameObject) {
		const enemy = e as Monkey
		enemy.alive = false;
		enemy.body.enable = false;
		this.tweens.add({
			targets: enemy,
			alpha: 0,           // Target alpha (opacity)
			duration: 1000,     // Duration of the tween in milliseconds (adjust as needed)
			onComplete: () => {
				// Once the tween is complete, set the enemy to inactive and destroy it
				// this.enemyGroup.killAndHide(enemy) 
				enemy.destroy();
				// enemy.disableBody(true, true);
			}
		});

		pg.destroy()

	}
	
}
