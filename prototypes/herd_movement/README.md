# Herd Movement Prototype

This prototype simulates a herd of cows with movement and grazing behavior using force vectors.

## Features
- **Cows**: Each has random color, size (10-20), speed (1-3), direction, and position.
- **Movement**: Random (forage) with cohesion (to center of gravity) and repulsive (from nearby cows) forces.
- **Spacing**: Maintains a minimum distance of 30 units between cows.
- **Grazing**: Represented by random movement within the force system.

## How to Run
Use the project launcher:
```bash
python launch.py herd_movement
```

## Notes
- The green background represents the grazing field.
- Cows are drawn as colored circles, moving based on the calculated force vectors.