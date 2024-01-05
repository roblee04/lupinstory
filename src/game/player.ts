import Phaser from 'phaser'
import TextureKeys from '../const/texturekeys';
import AnimationKeys from '../const/animationkeys';

import Projectile from './projectile'
export default class Player extends Phaser.GameObjects.Container {

	public lupin: Phaser.GameObjects.Sprite;
	// stats
	public health!: number;
	public mana!: number;
	public exp!: number;
	public level!: number;
	// controls
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys
	private keyALT!: Phaser.Input.Keyboard.Key;
	private keyA!: Phaser.Input.Keyboard.Key;

	public timeLastAttack!: number;
	private doingAction!: boolean;

	private attackSpeed!:number;

	// projectiles
	public projectileGroup!: Phaser.Physics.Arcade.Group;
	public direction!: number;

	// sounds
	private attack!: Phaser.Sound.BaseSound;
	private die!: Phaser.Sound.BaseSound;
	
	// if hit
	public hit!: number;


	constructor(scene: Phaser.Scene) {
		super(scene)

		this.lupin = scene.physics.add.sprite(100, 450, TextureKeys.Lupin)
			.setOrigin(0.5, 1) // 0.5 1
			.play(AnimationKeys.LupinIdle)
			

		
		this.add(this.lupin)
		// add physics, extension of lupin
		const body = this.lupin.body as Phaser.Physics.Arcade.Body
		body.setSize(50,55)
		// body.setCollideWorldBounds(true)

		// add movement
		this.cursors = scene.input.keyboard.createCursorKeys()
		this.keyALT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT)
		this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

		//stat init
		this.health = 100
		this.mana = 100
		this.exp = 0
		this.level= 1

		// attack init
		this.timeLastAttack = 0
		this.doingAction = false
		this.attackSpeed = 500;
		this.direction = 0;

		//add sound
		this.attack = scene.sound.add('lupin_attack');
    	this.die = scene.sound.add('lupin_die');

		// init projectiles
		this.projectileGroup = scene.physics.add.group({
			classType: Projectile,
			immovable: true,
			allowGravity: false
		});

		// hit
		this.hit = 100
		
		// this.physics.add.collider(p, platforms);
	}

	preload() {
		
	}

	create() {
		
	}

	preUpdate() {
		
		var body = this.lupin.body as Phaser.Physics.Arcade.Body
		var x_multi = 1
		if (this.lupin.body.velocity.y != 0) {
			x_multi = 0.65
		}
		
		if (this.keyA.isDown) { // attacking
			if(this.scene.time.now - this.timeLastAttack > this.attackSpeed) {
				this.mana -= 3
				// play sound
				this.attack.play();
				this.lupin.anims.play(AnimationKeys.LupinAttack);
				this.doingAction = true;
				this.timeLastAttack = this.scene.time.now
				// console.log(this.scene.time.now)
				// send out projectile
				const proj = new Projectile(this.scene, 0, 0, "banana")
				this.fireProjectile(proj)
				
			}
			if(this.lupin.body.velocity.y == 0) {
				body.setVelocityX(0)
			}
			
		}
		if(this.scene.time.now - this.timeLastAttack > this.attackSpeed) {
			this.doingAction = false;
			
		}

		if (this.cursors.left.isDown) {
			this.direction = 0; // face left
			this.lupin.setFlipX(false);
            body.setVelocityX(-230 * x_multi);
			if (this.keyALT.isDown && body.touching.down) {
				body.setVelocityY(-600);
			}
			if (!this.doingAction) {
				this.lupin.anims.play(AnimationKeys.LupinRun, true);
			}
        } else if (this.cursors.right.isDown) {
			this.direction = 1; // face right
			this.lupin.setFlipX(true);
            body.setVelocityX(230 * x_multi);
			if (this.keyALT.isDown && body.touching.down) {
				body.setVelocityY(-600);
			}
            if (!this.doingAction) {
				this.lupin.anims.play(AnimationKeys.LupinRun, true);
			}
        } 
		else if (this.keyALT.isDown && body.touching.down) {
			body.setVelocityY(-600);	
		} 
		 else {
			if (body.touching.down && !this.doingAction) {
				body.setVelocityX(0);
				this.lupin.anims.play(AnimationKeys.LupinIdle);
			}
        }
	}

	fireProjectile(p: Projectile) {
		// speed: number, texture: string
		// const texture:string = p.texture
		const texture = "banana"
		const speed = p.speed

		var offsetx = 0
		var offsety = -30
		var velocity = 0
		if (this.direction === 0) {
			offsetx = -25
			velocity = -speed
		} else {
			offsetx = 25
			velocity = speed
		}
		var projectile: Phaser.Physics.Arcade.Sprite = this.projectileGroup.create(this.lupin.x + offsetx, this.lupin.y + offsety, texture);
		// projectile.direction = this.direction  // need to add projectile class
		this.scene.physics.add.existing(projectile, true);
		projectile.setVelocityX(velocity)
		projectile.setCollideWorldBounds(true);
	}

}



