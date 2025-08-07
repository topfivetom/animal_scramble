import os
import sys
import asyncio

async def run_prototype(prototype_path):
    try:
        # Dynamically import and run the main function
        module = __import__(prototype_path.replace('/', '.').replace('.py', ''), fromlist=['main'])
        await module.main()
    except Exception as e:
        print(f"Error running prototype: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python launch.py <prototype_folder_name> (e.g., python launch.py color_grid)")
        sys.exit(1)

    prototype_name = sys.argv[1]
    prototype_path = f"prototypes/{prototype_name}/game"
    game_file = f"prototypes/{prototype_name}/game.py"
    if os.path.exists(game_file):
        asyncio.run(run_prototype(prototype_path))
    else:
        print(f"Prototype folder '{prototype_name}' not found or missing game.py.")
        sys.exit(1)