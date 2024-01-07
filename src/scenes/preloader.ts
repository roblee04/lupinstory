import Phaser from 'phaser'
import TextureKeys from '../const/texturekeys'
import SceneKeys from '../const/scenekeys'
import AnimationKeys from '../const/animationkeys'

// import static assets from public, vite build
import banana_spritesheet from "../../public/assets/lupin.png"
import lupin_spritesheet from "../../public/assets/lupin2.png"

// jsons
import banana_json from "../../public/assets/lupin.json"
import lupin_json from "../../public/assets/lupin2.json"

// etc assets
import bg from '../../public/assets/sky.png'
import ground from '../../public/assets/platform.png'
// import star from '../../public/assets/star.png'
// import bomb from '../../public/assets/bomb.png'

//sfx assets
// import attack_sfx from '../../public/assets/lupin_attack.mp3'
// import die_sfx from '../../public/assets/lupin_die.mp3'
// import hit_sfx from '../../public/assets/lupin_hit.mp3'

// map
import basetiles_png from '../../public/assets/tilemap.png'
import map_json from '../../public/assets/monkeymap.json'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super(SceneKeys.Preloader)
	}

	preload() {
		this.load.atlas("banana", banana_spritesheet, banana_json);
        this.load.atlas(TextureKeys.Lupin, lupin_spritesheet, lupin_json);


		this.load.image(TextureKeys.Background, bg);
		this.load.image(TextureKeys.Ground, ground);
		// this.load.image(TextureKeys.Star, star);
		// this.load.image(TextureKeys.Bomb, bomb);

		// load sounds
		// this.load.audio("lupin_attack", [attack_sfx]);
		// this.load.audio("lupin_die", [die_sfx]);
		// this.load.audio("lupin_hit", [hit_sfx]);
		
		// load map
		// load the PNG file
		this.load.image('base_tiles', basetiles_png)

		// load the JSON file
		this.load.tilemapTiledJSON('tilemap', map_json)
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
