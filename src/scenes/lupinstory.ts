import Phaser, { HEADLESS } from 'phaser'
import SceneKeys from '../const/scenekeys'
import TextureKeys from '../const/texturekeys';
import AnimationKeys from '../const/animationkeys';
import Player from '../game/player'
import Monkey from '../game/monkey'
import Projectile from '../game/projectile';
// import Projectile from '../game/projectile'

export default class LupinStory extends Phaser.Scene {
	private player!: Player
	private attack!: Phaser.Sound.BaseSound;
	private hit!: Phaser.Sound.BaseSound;
	private die!: Phaser.Sound.BaseSound;
	private damageNumbers!: Phaser.GameObjects.Group;
	private healthText!: Phaser.GameObjects.Text; // Add this line
    private manaText!: Phaser.GameObjects.Text; // Add this line
    private expText!: Phaser.GameObjects.Text; // Add this line
	private healthBar!: Phaser.GameObjects.Graphics; // Add this line
    private manaBar!: Phaser.GameObjects.Graphics; // Add this line
    private expBar!: Phaser.GameObjects.Graphics; // Add this line
	constructor() {
		super('game')
	}


	create() {
		// create sounds
		this.attack = this.sound.add('lupin_attack', { loop: false, volume: 0.5 });
    	this.hit = this.sound.add('lupin_hit', { loop: false, volume: 0.5 });
		this.die = this.sound.add('lupin_die', { loop: false, volume: 0.5 });

		// background
		this.add.image(400, 300, TextureKeys.Background);

		//map
		// const map = this.make.tilemap({ key: 'tilemap' })
		// const tileset = map.addTilesetImage('standard_tiles', 'base_tiles')
		// map.createLayer('ground', tileset)
		

		// large world bounds
		// this.physics.world.setBounds(0, 0, 1600, 12000);

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

		// camera centering player?
		
		this.cameras.main.setBounds(0, 0, 800, 600);
		this.cameras.main.startFollow(this.player.lupin.body, true, 0.5, 0.5);
		this.cameras.main.setLerp(0,0);
		// this.cameras.main.scrollX = 400;    ///  scrollX - Х top left point of camera
    	// this.cameras.main.scrollY = 400;

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
			const maxX = Math.min(platform.x + platform.displayWidth / 2, 800); // 800
			const minY = Math.max(platform.y - platform.displayHeight / 2, 0);
			const maxY = Math.min(platform.y + platform.displayHeight / 2, 600); //600
	 
			// Generate random positions for enemies within the bounds
			const x = Phaser.Math.Between(minX, maxX);
			const y = Phaser.Math.Between(minY, maxY) - 100;

			// const x = 100
			// const y = 100
	 
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

		// damage numbers
		this.damageNumbers = this.add.group();

		// Create text elements for health, mana, and exp
        this.healthText = this.add.text(16, 16, 'Health: 100', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
        });
        this.manaText = this.add.text(16, 48, 'Mana: 100', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
        });
        this.expText = this.add.text(16, 80, 'Exp: 0', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
        });

		this.healthBar = this.add.graphics();
        this.manaBar = this.add.graphics();
        this.expBar = this.add.graphics();

	}

	update(time: number, delta: number): void {
		super.update(time, delta)
		this.updateStatsDisplay();
		
		this.player.hit += 1
		console.log(this.player.hit)
	}

	handlePlayerEnemyCollision(this: Phaser.Scene, p : Phaser.GameObjects.GameObject, e : Phaser.GameObjects.GameObject) {
		// Handle collision logic
		// You can add health reduction, player damage, etc.
		const enemy = e as Monkey
		if(this.player.hit > 100) {
			this.player.health -= 5
			enemy.hit_sfx.play();
			if(enemy.body.position.x > p.body.position.x) { // left
				p.body.position.x = p.body.position.x - 50
			} else { // right
				p.body.position.x = p.body.position.x + 50
			}
			this.player.hit = 0
		} 
		
	}
	handleProjEnemyCollision(this: Phaser.Scene, pg : Phaser.GameObjects.GameObject, e : Phaser.GameObjects.GameObject) {
		const enemy = e as Monkey
		const proj = pg as Projectile

		if(proj.body == undefined) {
			return
		}

		enemy.health -= proj.damage
		enemy.hit_sfx.play();

		// dmg number
		this.displayDamageNumber(enemy.x, enemy.y, proj.damage);

		// simulate knockback
		if(proj.body.velocity.x > 0) { // left
			enemy.body.x = enemy.body.x + 20
		} else { // right
			enemy.body.x = enemy.body.x - 20
		}

		if(enemy.health <= 0) {
			enemy.die_sfx.play()
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
				this.player.exp += 5
			}
		});
		} else {
			// hit animation
			enemy.action = 4 //action 4 is hurt
			enemy.counter = 15
		}

		proj.hits += 1
		if(proj.hits > 0) {
			proj.destroy()
		}
		
		

	}

	displayDamageNumber(this: LupinStory, x: number, y: number, damage: number) {
        const damageNumber = this.add.text(x, y, `-${damage}`, {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#ff0000',
        });

        // Set up damage number properties
        damageNumber.setOrigin(0, 1.5);
        damageNumber.setAlpha(1);

        // Tween to make the damage number float up and fade out
        this.tweens.add({
            targets: damageNumber,
            y: y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                damageNumber.destroy();
            },
        });

        // Add the damage number to the group
        this.damageNumbers.add(damageNumber);
    }

	updateStatsDisplay() {
        // Update text elements with player's current stats
        this.healthText.setText(`Health: ${this.player.health}`);
        this.manaText.setText(`Mana: ${this.player.mana}`);
        this.expText.setText(`Exp: ${this.player.exp}`);

		this.updateBar(this.healthBar, this.player.health, 100, 16, 32, 200, 20);
        this.updateBar(this.manaBar, this.player.mana, 100, 16, 64, 200, 20);
        this.updateBar(this.expBar, this.player.exp, 100, 16, 96, 200, 20);
    }

	updateBar(bar: Phaser.GameObjects.Graphics, value: number, maxValue: number, x: number, y: number, width: number, height: number) {
		// Clear the existing bar
		bar.clear();
	
		// Draw the background of the bar
		bar.fillStyle(0x222222, 1);
		bar.fillRect(x, y, width, height);
	
		// Calculate the width of the bar based on the value and maxValue
		const barWidth = (value / maxValue) * width;
	
		// Choose the appropriate color for the bar
		let fillColor: number = 0x000000;
		if (bar === this.healthBar) {
			fillColor = 0x00ff00; // Green for health
		} else if (bar === this.manaBar) {
			fillColor = 0x0000ff; // Blue for mana
		} else if (bar === this.expBar) {
			fillColor = 0xffff00; // Yellow for exp
		}
	
		// Draw the actual bar with the chosen color
		bar.fillStyle(fillColor, 1);
		bar.fillRect(x, y, barWidth, height);
	}

	
}
