import asyncio
import platform
import pygame
import math
import random

FPS = 60

async def main():
    pygame.init()
    screen_width = 600
    screen_height = 600
    screen = pygame.display.set_mode((screen_width, screen_height))
    pygame.display.set_caption("Herd Movement Prototype")

    # Cow properties
    class Cow:
        def __init__(self, x, y):
            self.x = x
            self.y = y
            self.size = 15  # Fixed size
            self.speed = 2.0  # Initial speed
            self.direction = random.uniform(0, 2 * math.pi)  # Random initial direction
            self.color = (255, 0, 0)  # Fixed red color

        def move(self, dx, dy):
            self.x += dx
            self.y += dy
            self.x = max(self.size / 2, min(screen_width - self.size / 2, self.x))
            self.y = max(self.size / 2, min(screen_height - self.size / 2, self.y))
            self.direction = math.atan2(dy, dx)

    # Initialize herd
    herd_size = 20
    cows = [Cow(random.uniform(50, 550), random.uniform(50, 550)) for _ in range(herd_size)]
    min_distance = 30  # Minimum space between cows
    base_speed = 2.0   # Base speed for tuning
    attract_pos = None  # Position for attraction (right-click)
    repel_pos = None   # Position for repulsion (left-click)
    show_vectors = False  # Toggle for vector visualization

    running = True
    clock = pygame.time.Clock()

    def calculate_forces(cow):
        forage = [random.uniform(-1, 1), random.uniform(-1, 1)]  # Random forage vector
        repulsive = [0, 0]
        cohesion = [0, 0]
        attract = [0, 0]
        repel = [0, 0]

        # Calculate center of gravity
        cx = sum(c.x for c in cows) / len(cows)
        cy = sum(c.y for c in cows) / len(cows)
        cohesion[0] = (cx - cow.x) * 0.01  # Smaller magnitude cohesion vector
        cohesion[1] = (cy - cow.y) * 0.01

        # Repulsive force from nearest neighbor
        min_dist = float('inf')
        nearest = None
        for other in cows:
            if other != cow:
                dx = other.x - cow.x
                dy = other.y - cow.y
                dist = math.sqrt(dx * dx + dy * dy)
                if dist < min_dist and dist > 0:
                    min_dist = dist
                    nearest = (dx, dy)
        if nearest and min_dist < min_distance:
            repulsive[0] = -nearest[0] / min_dist  # Opposite direction
            repulsive[1] = -nearest[1] / min_dist

        # Attraction force toward right-click position
        if attract_pos:
            dx = attract_pos[0] - cow.x
            dy = attract_pos[1] - cow.y
            dist = max(1, math.sqrt(dx * dx + dy * dy))  # Avoid division by zero
            attract[0] = dx / dist * 0.02  # Moderate attraction force
            attract[1] = dy / dist * 0.02

        # Repulsion force from left-click position
        if repel_pos:
            dx = cow.x - repel_pos[0]
            dy = cow.y - repel_pos[1]
            dist = max(1, math.sqrt(dx * dx + dy * dy))  # Avoid division by zero
            repel[0] = dx / dist * 0.02  # Moderate repulsion force
            repel[1] = dy / dist * 0.02

        # Combine forces
        total_dx = forage[0] + repulsive[0] + cohesion[0] + attract[0] + repel[0]
        total_dy = forage[1] + repulsive[1] + cohesion[1] + attract[1] + repel[1]
        magnitude = math.sqrt(total_dx * total_dx + total_dy * total_dy)
        if magnitude > 0:
            total_dx /= magnitude
            total_dy /= magnitude
        return total_dx * cow.speed, total_dy * cow.speed, forage, repulsive, cohesion, attract, repel

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left click for repulsion
                    repel_pos = event.pos
                elif event.button == 3:  # Right click for attraction
                    attract_pos = event.pos
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    base_speed += 0.1
                    print(f"Speed increased to {base_speed}")
                elif event.key == pygame.K_DOWN and base_speed > 0.1:
                    base_speed -= 0.1
                    print(f"Speed decreased to {base_speed}")
                elif event.key == pygame.K_RIGHT:
                    min_distance += 1
                    print(f"Min distance increased to {min_distance}")
                elif event.key == pygame.K_LEFT and min_distance > 1:
                    min_distance -= 1
                    print(f"Min distance decreased to {min_distance}")
                elif event.key == pygame.K_v:
                    show_vectors = not show_vectors
                    print(f"Vector visualization {'enabled' if show_vectors else 'disabled'}")

        screen.fill((0, 255, 0))  # Green background

        for cow in cows:
            cow.speed = base_speed  # Apply tuned speed
            dx, dy, forage, repulsive, cohesion, attract, repel = calculate_forces(cow)
            cow.move(dx, dy)

            # Draw cow
            pygame.draw.circle(screen, cow.color, (int(cow.x), int(cow.y)), int(cow.size / 2))

            # Draw vectors if enabled
            if show_vectors:
                scale = 20  # Scale factor for vector length
                # Forage (yellow)
                pygame.draw.line(screen, (255, 255, 0), (int(cow.x), int(cow.y)), 
                                (int(cow.x + forage[0] * scale), int(cow.y + forage[1] * scale)), 1)
                # Repulsive (red)
                pygame.draw.line(screen, (255, 0, 0), (int(cow.x), int(cow.y)), 
                                (int(cow.x + repulsive[0] * scale), int(cow.y + repulsive[1] * scale)), 1)
                # Cohesion (blue)
                pygame.draw.line(screen, (0, 0, 255), (int(cow.x), int(cow.y)), 
                                (int(cow.x + cohesion[0] * scale), int(cow.y + cohesion[1] * scale)), 1)
                # Attract (green)
                pygame.draw.line(screen, (0, 255, 0), (int(cow.x), int(cow.y)), 
                                (int(cow.x + attract[0] * scale), int(cow.y + attract[1] * scale)), 1)
                # Repel (purple)
                pygame.draw.line(screen, (128, 0, 128), (int(cow.x), int(cow.y)), 
                                (int(cow.x + repel[0] * scale), int(cow.y + repel[1] * scale)), 1)

        pygame.display.flip()
        await asyncio.sleep(1.0 / FPS)  # Control frame rate

    pygame.quit()

if platform.system() == "Emscripten":
    asyncio.ensure_future(main())
else:
    if __name__ == "__main__":
        asyncio.run(main())