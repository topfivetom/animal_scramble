// Load and parse config.json
async function loadConfig() {
  try {
    const response = await fetch('./config.json');
    const config = await response.json();
    return {
      diseaseSpreadRate: config.diseaseSpreadRate || 0.05,
      grassRegrowthRate: config.grassRegrowthRate || 0.02,
      cowMovementSpeed: config.cowMovementSpeed || 5,
      initialHerdSize: config.initialHerdSize || 10,
      startingBudget: config.startingBudget || 50000,
      collisionDetection: config.collisionDetection || true
    };
  } catch (error) {
    console.error('Error loading config:', error);
    return {
      diseaseSpreadRate: 0.05,
      grassRegrowthRate: 0.02,
      cowMovementSpeed: 5,
      initialHerdSize: 10,
      startingBudget: 50000,
      collisionDetection: true
    };
  }
}

window.config = loadConfig();