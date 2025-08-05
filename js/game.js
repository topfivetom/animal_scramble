const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
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

async function preload() {
  configData = await window.config;
  this.load.setPath('./src/assets/'); // Placeholder for future assets
}

function create() {
  const gridWidth = 30;
  const gridHeight = 20; // Reduced for initial testing, scale to 4000 later
  const tileSize = 20;

  // Create tiles (grass)
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const tile = this.add.text(x * tileSize, y * tileSize, '.', { fontSize: '16px', color: '#00ff00' });
      tiles.push({ sprite: tile, x: x, y: y, grass: 1.0 });
    }
  }

  // Create fences (vertical line)
  const fence = this.add.rectangle(gridWidth * tileSize / 2, 0, 2, gridHeight * tileSize, 0x000000);
  fences.push(fence);
  this.physics.add.existing(fence);
  fence.body.setImmovable(true);

  // Create cows
  for (let i = 0; i < configData.initialHerdSize; i++) {
    const cow = this.add.text(Phaser.Math.Between(0, gridWidth - 1) * tileSize, Phaser.Math.Between(0, gridHeight - 1) * tileSize, 'C', { fontSize: '16px', color: '#ff0000' });
    this.physics.add.existing(cow);
    cow.body.setCollideWorldBounds(false);
    cows.push({ sprite: cow, x: cow.x / tileSize, y: cow.y / tileSize, hunger: 0 });
  }

  this.physics.add.collider(cows.map(c => c.sprite), fences);

  // Debug text
  this.add.text(10, 10, 'Herd Behavior Prototype - Cows: ' + configData.initialHerdSize, { fontSize: '16px', color: '#ffffff' });
}

function update() {
  cows.forEach(cow => {
    const speed = configData.cowMovementSpeed;
    const dx = Phaser.Math.Between(-speed, speed);
    const dy = Phaser.Math.Between(-speed, speed);
    cow.sprite.x += dx;
    cow.sprite.y += dy;
    cow.x = cow.sprite.x / 20;
    cow.y = cow.sprite.y / 20;

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