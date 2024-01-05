import Phaser from 'phaser'
import TextureKeys from '../const/texturekeys'
import SceneKeys from '../const/scenekeys'
import AnimationKeys from '../const/animationkeys'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super(SceneKeys.Preloader)
	}

	preload() {
		this.load.atlas("banana", "../../public/assets/lupin.png", "../public/assets/lupin.json");
        this.load.atlas(TextureKeys.Lupin, "../../public/assets/lupin2.png", "../public/assets/lupin2.json");


		this.load.image(TextureKeys.Background, '../../public/assets/sky.png');
		this.load.image(TextureKeys.Ground, '../../public/assets/platform.png');
		this.load.image(TextureKeys.Star, '../../public/assets/star.png');
		this.load.image(TextureKeys.Bomb, '../../public/assets/bomb.png');

		// load sounds
		this.load.audio("lupin_attack", ['../../public/assets/lupin_attack.mp3']);
		this.load.audio("lupin_die", ['../../public/assets/lupin_die.mp3']);
		this.load.audio("lupin_hit", ['../../public/assets/lupin_hit.mp3']);
		
		// load map
		// load the PNG file
		this.load.image('base_tiles', '../../public/assets/tilemap.png')

		// load the JSON file
		this.load.tilemapTiledJSON('tilemap', '../../public/assets/monkeymap.json')
	}

	create() {
		this.scene.start('game');

		// monkey frames
		this.anims.create({ key: AnimationKeys.LupinIdle, frames: this.anims.generateFrameNames(
			TextureKeys.Lupin, { prefix: 'stand_', end: 0, zeroPad:1})
			, repeat: -1});

		this.anims.create({ key: AnimationKeys.LupinRun, frames: this.anims.generateFrameNames(
			TextureKeys.Lupin, { prefix: 'move_', end: 3, zeroPad:0})
			, frameRate: 5, repeat: -1});
		
		// this.anims.create({ key: AnimationKeys.LupinEat, frames: this.anims.generateFrameNames(
		// 	TextureKeys.Lupin, { prefix: 'eat', end: 2, zeroPad:1})
		// 	, frameRate: 5, repeat: -1});
		
		// this.anims.create({ key: AnimationKeys.LupinThrow, frames: this.anims.generateFrameNames(
		// 	TextureKeys.Lupin, { prefix: 'throw', end: 3, zeroPad:1})
		// 	, frameRate: 5, repeat: -1});

		// this.anims.create({ key: AnimationKeys.LupinReload, frames: this.anims.generateFrameNames(
		// 	TextureKeys.Lupin, { prefix: 'reload', end: 2, zeroPad:1})
		// 	, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: AnimationKeys.LupinHurt, frames: this.anims.generateFrameNames(
			TextureKeys.Lupin, { prefix: 'hit1_', end: 0, zeroPad:0})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: AnimationKeys.LupinDie, frames: this.anims.generateFrameNames(
			TextureKeys.Lupin, { prefix: 'die1_', end: 2, zeroPad:0})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({ key: AnimationKeys.BananaProjectile, frames: this.anims.generateFrameNames(
			"banana", { prefix: 'banana', end: 5, zeroPad:1})
			, frameRate: 5, repeat: -1});
		
		this.anims.create({
			key: AnimationKeys.LupinAttack,
			frames: 
			this.anims.generateFrameNames(TextureKeys.Lupin, { prefix: 'attack1_', end: 10, zeroPad: 1 }),
			frameRate: 10,
			repeat: 0
		});

	}
}
