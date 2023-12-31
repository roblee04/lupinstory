import Phaser, { Game } from 'phaser'

// import HelloWorldScene from './HelloWorldScene'
import MyGame from './mygame'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			debug:true
		},
	},
	scene: [MyGame],
}

export default new Phaser.Game(config)
