import asyncio
import platform
import pygame
import time

FPS = 60

async def main():
    pygame.init()
    grid_width = 20
    grid_height = 20
    tile_size = 30
    screen_width = grid_width * tile_size
    screen_height = grid_height * tile_size

    screen = pygame.display.set_mode((screen_width, screen_height))
    pygame.display.set_caption("Simple Grid Prototype")

    # Initialize tiles with state and timestamps
    tiles = [[{'state': 0, 'last_click': 0} for _ in range(grid_width)] for _ in range(grid_height)]
    screen.fill((0, 0, 0))  # Start with entire map green
    for y in range(grid_height):
        for x in range(grid_width):
            pygame.draw.rect(screen, (0, 255, 0), (x * tile_size, y * tile_size, tile_size, tile_size))
    pygame.display.flip()

    running = True
    clock = pygame.time.Clock()

    def update_tile_color(x, y):
        current_time = time.time()
        tile_data = tiles[y][x]
        if tile_data['last_click'] > 0:
            elapsed = current_time - tile_data['last_click']
            if elapsed < 2:
                color = (144, 238, 144)  # Light green
            elif elapsed < 4:
                color = (34, 139, 34)    # Slightly darker green
            else:
                color = (0, 255, 0)      # Original green
                tile_data['last_click'] = 0  # Reset if cycle complete
            pygame.draw.rect(screen, color, (x * tile_size, y * tile_size, tile_size, tile_size))
            pygame.display.flip()
        elif tile_data['state'] == 0:
            pygame.draw.rect(screen, (0, 255, 0), (x * tile_size, y * tile_size, tile_size, tile_size))
            pygame.display.flip()

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                pos = pygame.mouse.get_pos()
                x, y = pos[0] // tile_size, pos[1] // tile_size
                if 0 <= x < grid_width and 0 <= y < grid_height:
                    tiles[y][x]['last_click'] = time.time()
                    update_tile_color(x, y)

        # Update all tiles
        for y in range(grid_height):
            for x in range(grid_width):
                update_tile_color(x, y)

        await asyncio.sleep(1.0 / FPS)  # Control frame rate

    pygame.quit()

if platform.system() == "Emscripten":
    asyncio.ensure_future(main())
else:
    if __name__ == "__main__":
        asyncio.run(main())