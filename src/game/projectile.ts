import Phaser from 'phaser'
import TextureKeys from '../const/texturekeys';
import AnimationKeys from '../const/animationkeys';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    //speed, damage, texture
    public speed!: number;
    public damage!: number;
    
    constructor(scene: Phaser.Scene, x:number, y:number, texture:string) {
        super(scene, x, y, texture)

        // banana projectile
        this.anims.play(AnimationKeys.BananaProjectile)
    }

}
