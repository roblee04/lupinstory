import Phaser from 'phaser'
import TextureKeys from '../const/texturekeys';
import AnimationKeys from '../const/animationkeys';

export default class Monkey extends Phaser.Physics.Arcade.Sprite {
    public health!: number;
    public counter!: number;
    public action!: number;
    public alive!: boolean;
    public hit!: boolean;
    private stunTime!: number;
    private timeLastAction!: number

    // sounds
	private attack_sfx!: Phaser.Sound.BaseSound;
    public hit_sfx!: Phaser.Sound.BaseSound;
	public die_sfx!: Phaser.Sound.BaseSound;


	constructor(scene: Phaser.Scene, x:number, y:number, texture:string) {
		super(scene, x, y, texture)

        //add sound
		// this.attack_sfx = scene.sound.add('lupin_attack');
        // this.hit_sfx = scene.sound.add('lupin_hit');
    	// this.die_sfx = scene.sound.add('lupin_die');

        // init values
        this.health = 100
        this.counter = Phaser.Math.Between(0, 50)
        this.action = Phaser.Math.Between(0, 2)
        this.alive = true
        this.timeLastAction = 0
        
	}

	preload() {
		
	}

	create() {
		
	}

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        
        if (this.alive === false) {
            this.setVelocityX(0);
            this.anims.play(AnimationKeys.LupinDie, true);
        } else {

        
        // flip a coin, go left or right
        if (this.counter == 0) {
            this.action = Phaser.Math.Between(0, 2);
            this.counter = 50;
        }
        
        if (this.action === 0) {
            this.setVelocityX(100);
            this.flipX = true; // Flip the sprite horizontally
            this.anims.play(AnimationKeys.LupinRun, true);
        } else if (this.action === 1) {
            this.setVelocityX(-100);
            this.flipX = false; // Reset the flip to its default state
            this.anims.play(AnimationKeys.LupinRun, true);
        } else if (this.action === 4) {
            this.setVelocityX(0);
            this.anims.play(AnimationKeys.LupinHurt, true);
        } 
        else {
            this.setVelocityX(0);
            this.anims.play(AnimationKeys.LupinIdle, true);
        }
        this.counter -= 1;

    }
    }
}
