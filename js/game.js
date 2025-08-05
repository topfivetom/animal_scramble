class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.configData = {}; // Initialize configData as a class property
  }

  async preload() {
    this.configData = await window.config;
    console.log("Preload started, configData:", this.configData);
    this.load.setPath('./assets/'); // Placeholder for future assets
  }

  async create() {
    // Wait for configData to be set from preload
    while (!Object.keys(this.configData).length) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Poll until config is loaded
    }
    console.log("Create function executing, configData:", this.configData);
    const configData = this.configData || { initialHerdSize: 10, cowMovementSpeed: 5 }; // Fallback
    const gridWidth = 30;
    const gridHeight = 20; // Reduced for testing, scale to 4000 later
    const tileSize = 20;

    // Set background color to see the canvas
    this.cameras.main.setBackgroundColor('#87CEEB'); // Light sky blue

    // Create tiles (grass)
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const tile = this.add.text(x * tileSize, y * tileSize + 50, '.', { fontSize: '16px', color: '#00ff00' }); // Offset by 50
        tiles.push({ sprite: tile, x: x, y: y, grass: 1.0 });
      }
    }

    // Create fences (full height vertical line, centered)
    const fence = this.add.rectangle(gridWidth * tileSize / 2, 50, 2, this.sys.game.config.height - 100, 0x000000);
    this.physics.add.staticGroup().add(fence); // Use static group for immovable objects
    fences.push(fence);
    fence.body.setSize(2, this.sys.game.config.height - 100); // Match physics body
    fence.body.debugBodyColor = 0x000000; // Force black debug color

    // Create cows
    for (let i = 0; i < configData.initialHerdSize; i++) {
      const cow = this.add.text(Phaser.Math.Between(0, gridWidth - 1) * tileSize, Phaser.Math.Between(50, gridHeight * tileSize + 50), 'C', { fontSize: '16px', color: '#ff0000' });
      this.physics.add.existing(cow);
      cow.body.setCollideWorldBounds(false);
      cows.push({ sprite: cow, x: cow.x / tileSize, y: (cow.y - 50) / tileSize, hunger: 0 });
    }

    this.physics.add.collider(cows.map(c => c.sprite), fences);

    // Debug text
    this.add.text(10, 10, 'Herd Behavior Prototype - Cows: ' + configData.initialHerdSize, { fontSize: '16px', color: '#ffffff' });
  }

  update() {
    cows.forEach(cow => {
      const speed = this.configData.cowMovementSpeed || 5; // Fallback
      const dx = Phaser.Math.Between(-speed, speed);
      const dy = Phaser.Math.Between(-speed, speed);
      cow.sprite.x += dx;
      cow.sprite.y += dy;
      cow.x = cow.sprite.x / 20;
      cow.y = (cow.sprite.y - 50) / 20;

      // Grazing
      const tileIndex = tiles.findIndex(t => Math.abs(t.x - cow.x) < 0.5 && Math.abs(t.y - cow.y) < 0.5);
      if (tileIndex !== -1 && tiles[tileIndex].grass > 0) {
        tiles[tileIndex].grass = Math.max(0, tiles[tileIndex].grass - 0.01);
        tiles[tileIndex].sprite.setText(tiles[tileIndex].grass > 0.5 ? '.' : ' ');
      }

      // Trampling
      if (Math.random() < 0.01) {
        if (tileIndex !== -1) tiles[tileIndex].trampled = true;
      }
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  parent: 'game-container',
  scene: GameScene,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
};

let game = new Phaser.Game(config);
let cows = [];
let tiles = [];
let fences = [];
let configData = {};