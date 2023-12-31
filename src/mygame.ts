import Phaser from 'phaser'

export default class MyGame extends Phaser.Scene {
	// hack
	private player!: Phaser.Physics.Arcade.Sprite;
	private keyALT!: Phaser.Input.Keyboard.Key;
	private keyA!: Phaser.Input.Keyboard.Key;
	private enemyGroup!: Phaser.Physics.Arcade.Group;
	private projectiles!: Phaser.Physics.Arcade.Group;

	constructor() {
		super('game');
	}

	preload() {
		// load assets
		this.load.atlas("lupin", "../public/assets/lupin.png", "../public/assets/lupin.json");


		this.load.image('sky', '../public/assets/assets2/sky.png');
		this.load.image('ground', '../public/assets/assets2/platform.png');
		this.load.image('star', '../public/assets/assets2/star.png');
		this.load.image('bomb', '../public/assets/assets2/bomb.png');
		
	}

	create() {
		// keyboard input
		this.keyALT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT);
		this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

		// background
		this.add.image(400, 300, 'sky');

		// platforms
		const platforms = this.physics.add.staticGroup();
		platforms.create(400, 568, 'ground').setScale(2).refreshBody();

		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');
		//https://www.leshylabs.com/apps/sstool/
		// monkey frames
		this.anims.create({ key: 'idle', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'idle', end: 0, zeroPad:1})
			, repeat: -1});

		this.anims.create({ key: 'run', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'run', end: 2, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: 'eat', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'eat', end: 2, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: 'throw', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'throw', end: 3, zeroPad:1})
			, frameRate: 5, repeat: -1});

		this.anims.create({ key: 'reload', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'reload', end: 2, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: 'hurt', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'hurt', end: 0, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: 'throw', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'throw', end: 2, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: 'die', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'die', end: 2, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: 'banana', frames: this.anims.generateFrameNames(
			'lupin', { prefix: 'banana', end: 5, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({
			key: 'attack',
			frames: [
				...this.anims.generateFrameNames('lupin', { prefix: 'eat', end: 2, zeroPad: 1 }),
				...this.anims.generateFrameNames('lupin', { prefix: 'throw', end: 3, zeroPad: 1 }),
				...this.anims.generateFrameNames('lupin', { prefix: 'reload', end: 2, zeroPad: 1 })
			],
			frameRate: 50,
			repeat: 0
		});

		
		// player monkey
		this.player = this.physics.add.sprite(100, 450, 'lupin');
		this.physics.add.collider(this.player, platforms);
		this.player.setCollideWorldBounds(true);

		// create drop
		const drops = this.physics.add.group({
			key: "star",
			repeat: 11,
			setXY: {x: 12, y:0, stepX: 70},
		});
		drops.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		this.physics.add.collider(drops, platforms);
		this.physics.add.overlap(this.player, drops, collectDrop, null, this);
		
		function collectDrop (player, drop){
			drop.disableBody(true, true);
			// drop.destroy();
		}

		// create enemies
		this.enemyGroup = this.physics.add.group({
            key: 'lupin', // Replace 'enemy' with your enemy asset key
            repeat: 4,    // Number of enemies in the group
            setXY: { x: 300, y: 350, stepX: 100 }  // Initial position and spacing
        });
		this.enemyGroup.children.iterate(enemy => {
			// physics
            enemy.setCollideWorldBounds(true);
			this.physics.add.collider(enemy, platforms);
			// animations
			enemy.anims.play('idle', true);
			enemy.health = 100;  // Set initial health
            enemy.counter = 0;   // Set initial counter value
			enemy.action = 0;
			enemy.alive = 1;
        });

        // Add collision between player and enemies in the group
        this.physics.add.overlap(this.player, this.enemyGroup, handlePlayerEnemyCollision, null, this);

		function handlePlayerEnemyCollision(player, enemy) {
			// Handle collision logic
			// You can add health reduction, player damage, etc.
			enemy.alive = 0;
			enemy.body.enable = false;
			// add tween
			this.tweens.add({
				targets: enemy,
				alpha: 0,           // Target alpha (opacity)
				duration: 1000,     // Duration of the tween in milliseconds (adjust as needed)
				onComplete: () => {
					// Once the tween is complete, set the enemy to inactive and destroy it
					// this.enemyGroup.killAndHide(enemy) 
					// enemy.destroy();
					enemy.disableBody(true, true);
				}
			});
				
			
		}

		// create projectiles
		this.projectiles = this.physics.add.group({
			defaultKey: 'bomb',  // Replace 'projectile' with the key of your projectile sprite
			// maxSize: 10,  // Adjust as needed
			runChildUpdate: true,
			allowGravity: false
		});

		this.physics.add.overlap(this.projectiles, this.enemyGroup, handleProjectileEnemyCollision, null, this);

		function handleProjectileEnemyCollision(projectile, enemy) {
			// Disable the projectile
			projectile.setActive(false).setVisible(false);
		
			enemy.alive = 0;
			enemy.body.enable = false;
			// enemy.destroy();
			// add tween
			this.tweens.add({
				targets: enemy,
				// y: enemy.y + 20,
				alpha: 0,           // Target alpha (opacity)
				duration: 1000,     // Duration of the tween in milliseconds (adjust as needed)
				onComplete: () => {
					// Once the tween is complete, set the enemy to inactive and destroy it
					// this.enemyGroup.killAndHide(enemy) 
					// enemy.destroy();
					enemy.disableBody(true, true);
				}
			});
		}
	}

    update(): void {
		// movement
        const cursors = this.input.keyboard.createCursorKeys();
		var x_multi = 1
		if (this.player.body.velocity.y != 0) {
			x_multi = 0.65
		}
		if (this.keyA.isDown) { // attacking
			this.player.anims.play('attack');
			
			shootProjectile.call(this);
			
			function shootProjectile() {
				const projectile = this.projectiles.get(this.player.x, this.player.y); // Get a projectile from the group
			
				if (projectile) {
					projectile.setActive(true).setVisible(true); // Make the projectile active and visible
					projectile.setVelocityX(300); // Adjust the projectile velocity as needed
				}
			}
		}
		if (cursors.left.isDown) {
			this.player.setFlipX(false);
            this.player.setVelocityX(-230 * x_multi);
			if (this.keyALT.isDown && this.player.body.touching.down) {
				this.player.setVelocityY(-600);
			}
            this.player.anims.play('run', true);
        } else if (cursors.right.isDown) {
			this.player.setFlipX(true);
            this.player.setVelocityX(230 * x_multi);
			if (this.keyALT.isDown && this.player.body.touching.down) {
				this.player.setVelocityY(-600);
			}
            this.player.anims.play('run', true);
        } else if (this.keyALT.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-600);	
		} 
		 else {
			if (this.player.body.touching.down && this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run') {
				this.player.setVelocityX(0);
				this.player.anims.play('idle');
			}
            
        }

		// enemy movement
		this.enemyGroup.children.iterate(enemy => {
			if (enemy.alive === 0) {
				enemy.setVelocityX(0);
				enemy.anims.play('die', true);
			} else {

			
			// flip a coin, go left or right
			if (enemy.counter == 0) {
				enemy.action = Phaser.Math.Between(0, 2);
				enemy.counter = 50;
			}
			
			if (enemy.action === 0) {
				enemy.setVelocityX(100);
				enemy.flipX = true; // Flip the sprite horizontally
				enemy.anims.play('run', true);
			} else if (enemy.action === 1) {
				enemy.setVelocityX(-100);
				enemy.flipX = false; // Reset the flip to its default state
				enemy.anims.play('run', true);
			} else {
				enemy.setVelocityX(0);
				enemy.anims.play('idle', true);
			}
			enemy.counter -= 1;

		}
		});

		
    }

}
