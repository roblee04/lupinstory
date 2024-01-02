import Phaser, { Game } from 'phaser'

// import HelloWorldScene from './HelloWorldScene'
import Preloader from './scenes/preloader'
import LupinStory from './scenes/lupinstory'
// import HelloWorldScene from './scenes/game'

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
	scene: [Preloader, LupinStory],
}

export default new Phaser.Game(config)
