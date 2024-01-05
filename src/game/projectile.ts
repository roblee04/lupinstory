import Phaser from 'phaser'
import TextureKeys from '../const/texturekeys';
import AnimationKeys from '../const/animationkeys';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    //speed, damage, texture
    public speed!: number;
    public damage!: number;
    public direction!: number; // 0 is left, 1 is right
    public hits!: number;
    
    constructor(scene: Phaser.Scene, x:number, y:number, texture:string) {
        super(scene, x, y, texture)
        this.speed = 400
        this.damage = 50
        this.hits = 0

        // banana projectile
        this.anims.play(AnimationKeys.BananaProjectile)
    }

}
