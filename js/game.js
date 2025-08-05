class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.configData = {}; // Initialize configData as a class property
    this.lastRegrowthTime = 0;
    this.regrowthInterval = 2000; // 2 seconds for regrowth cycle
    this.cows = []; // Initialize cows array at class level
    this.tiles = []; // Initialize tiles array at class level
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
    const configData = this.configData || { initialHerdSize: 10, cowMovementSpeed: 5 };
    const gridWidth = 100;
    const gridHeight = 100; // 100x100 tiles
    const tileSize = 6; // Adjusted tile size to fit 600x600
    const canvasWidth = gridWidth * tileSize;
    const canvasHeight = gridHeight * tileSize;

    // Set canvas size to match grid
    this.sys.game.canvas.width = canvasWidth;
    this.sys.game.canvas.height = canvasHeight;
    this.cameras.main.setSize(canvasWidth, canvasHeight);

    // Set background color to green for entire canvas
    this.cameras.main.setBackgroundColor('#00FF00'); // Full green

    // Create tiles with initial energy and draw grid lines
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x000000, 0.2); // Thin black grid lines
    for (let y = 0; y <= gridHeight; y++) {
      graphics.moveTo(0, y * tileSize);
      graphics.lineTo(canvasWidth, y * tileSize);
    }
    for (let x = 0; x <= gridWidth; x++) {
      graphics.moveTo(x * tileSize, 0);
      graphics.lineTo(x * tileSize, canvasHeight);
    }
    graphics.strokePath();

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const tile = this.add.rectangle(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize, tileSize, 0x00FF00); // Green
        this.tiles.push({ sprite: tile, x: x, y: y, energy: 9, lastEaten: 0 });
      }
    }

    // Create cows and align them to tile centers
    for (let i = 0; i < configData.initialHerdSize; i++) {
      const startTile = this.tiles[Math.floor(Math.random() * this.tiles.length)];
      const cow = this.add.text(startTile.x, startTile.y, 'C', { fontSize: '12px', color: '#ff0000' });
      this.cows.push({ sprite: cow, currentTile: startTile });
    }

    // Start update loop
    this.time.addEvent({ delay: 1000, callback: this.update, callbackScope: this, loop: true });
  }

  update() {
    const currentTime = this.time.now;
    const configData = this.configData || { cowMovementSpeed: 5 };
    const tileSize = 6;
    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;

    // Move cows randomly within bounds and align to tiles
    this.cows.forEach(cow => {
      if (Math.random() < 0.1) { // 10% chance to move each update
        let newTile = this.tiles[Math.floor(Math.random() * this.tiles.length)];
        let newX = newTile.x;
        let newY = newTile.y;
        if (newX >= tileSize / 2 && newX <= canvasWidth - tileSize / 2 && newY >= tileSize / 2 && newY <= canvasHeight - tileSize / 2) {
          cow.sprite.x = newX;
          cow.sprite.y = newY;
          cow.currentTile = newTile;
        }
      }

      // Eat grass
      const tile = cow.currentTile;
      if (tile.energy >= 5) {
        tile.energy -= 5;
        tile.lastEaten = currentTime;
        this.updateTileColor(tile);
      }
    });

    // Regrowth cycle
    if (currentTime - this.lastRegrowthTime >= this.regrowthInterval) {
      this.tiles.forEach(tile => {
        if (tile.lastEaten > 0 && currentTime - tile.lastEaten >= this.regrowthInterval * 2) {
          if (tile.energy < 9) tile.energy += 2; // Regrow by 2 units
          tile.lastEaten = 0; // Reset if fully regrown
        }
        this.updateTileColor(tile);
      });
      this.lastRegrowthTime = currentTime;
    }
  }

  updateTileColor(tile) {
    const energy = tile.energy;
    if (tile.lastEaten > 0) {
      if (this.time.now - tile.lastEaten < this.regrowthInterval) {
        tile.sprite.setFillStyle(0x90EE90); // Light green after eating
      } else if (this.time.now - tile.lastEaten < this.regrowthInterval * 2) {
        tile.sprite.setFillStyle(0x228B22); // Darker green during regrowth
      }
    } else if (energy >= 9) {
      tile.sprite.setFillStyle(0x00FF00); // Full green when recovered
    }
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
let configData = [];