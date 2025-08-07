# Resource Management Game Design Document

## Overview

This is a desktop-focused, browser-based resource management simulation inspired by holistic management principles, with gameplay similar to SimCity or Civilization. Players manage a herd of cows on a plot of land, aiming to grow their herd, maintain pasture health, and build wealth. The game uses agent-based cow behavior, tile-based pasture dynamics, and infrastructure management, with a modular architecture for prototyping and future expansions (e.g., weather, genetics, labor). The MVP focuses on core mechanics for a 30-acre (120,000 square meter) starting plot, with stretch goals for larger scales and complex features.

## Core Gameplay

Players start with a 30-acre plot (120,000 square meters), a small herd, and limited resources (money, fencing, water infrastructure, grass). The goal is to optimize herd growth, pasture sustainability, and finances using rotational grazing. Players divide land into paddocks, manage herd movements with a grazing planner, and balance resources, with gameplay lasting \~10 mins per simulated year. Time can be sped up or slowed down.

### Objectives

- **Grow the Herd**: Increase herd size through breeding and purchases.
- **Maintain Pasture Health**: Balance grazing, trampling, and manure for sustainable pastures.
- **Build Wealth**: Generate income by selling live animals or meat while managing expenses.
- **Sustainability**: Avoid overgrazing, undergrazing, disease, or bankruptcy.

### Campaign Mode (MVP Scope)

- **Stage 1**: 30 acres (120,000 m²), small herd (e.g., 10 cows, 1 bull), $50,000 starting budget, no debt.
- **Future Stages**: 200 acres, 1,000 acres, 10,000 acres (post-MVP, with larger herds and more detailed dynamics).
- **Starting Scenarios**: Players select from predefined scenarios on the home screen:
  - **Easy**: Large budget ($100,000), small herd (10 cows, 1 bull), no debt.
  - **Medium**: Moderate budget ($100,000), medium herd (20 cows, 1 bull), no debt.
  - **Hard**: Low budget ($100,000), large herd (50 cows, 2 bulls), $5,000 debt.
- **Milestones**: Achieve specific herd sizes (e.g., 20 cows) and wealth ($10,000) within a set time (e.g., 5 years).

### Challenges

- **Overgrazing**: Excessive grazing depletes grass, reducing pasture productivity.
- **Undergrazing**: Insufficient grazing leads to overgrown, low-quality forage.
- **Overpopulation**: Too many cows increase feed and disease costs.
- **Disease**: Feces accumulation causes disease spread, modeled with contact-based mechanics.
- **Feed Shortages**: Insufficient grass or hay leads to hunger, reducing weight and reproduction.

## Resources

- **Herd of Cows**: Primary asset, requiring food, water, and space.
- **Grass**: Primary food source, requiring balanced grazing and trampling.
- **Electric Fencing**: Divides land into paddocks for rotational grazing.
- **Water Lines/Troughs**: Ensure water access across paddocks.
- **Shade**: Reduces heat stress, impacting health and productivity.
- **Money**: Used for purchases and infrastructure.

## Purchases

- **Fence Posts, Chargers, Wiring**: Create and power electric fences.
- **Cows, Bulls, Calves**: Expand the herd.
- **Hay**: Supplemental feed for grass shortages.

## Game Dynamics

The simulation runs in real-time on a tile-based grid (1 tile = 1 square meter), with agent-based cow behavior and dynamic plant growth. Players use a grazing planner to schedule herd rotations, automating moves unless overridden manually.

### Cows

Each cow is an individual agent with unique stats stored in a database, viewable individually or summarized (e.g., average herd weight).

#### Actions

- **Graze**: Consume grass to gain weight, based on pasture quality.
- **Sleep**: Rest to maintain health.
- **Mate**: Bulls and non-pregnant cows reproduce, producing calves.
- **Birth**: Pregnant cows deliver calves after gestation.
- **Trample**: Contribute to soil health when balanced.
- **Poop/Pee**: Fertilize pastures or increase disease risk if excessive.
- **Feed**: Consume hay when grass is insufficient.
- **Alert**: Signal issues (e.g., hunger, sickness).

#### Attributes

- **Pregnant**: Tracks gestation status.
- **Sex**: Male (bulls) or female (cows, calves).
- **Hungry**: Impacts weight and reproduction.
- **Sick**: Reduces productivity, triggered by disease spread.
- **Life Stage**: Calf, mature cow, or bull.
- **Weight**: Affects market value and reproduction.
- **Fertility**: Influences mating success.

### Plants

Plants (grasses, forbs) grow on a tile-based grid, with health tied to grazing, trampling, and manure.

#### Actions

- **Seed**: Spread to adjacent tiles under favorable conditions.
- **Grow**: Increase biomass based on soil health, water, and grazing balance.

#### Attributes

- **Growth Stage**: Determines edibility and resilience.
- **Trampled**: Moderate trampling aids soil health.
- **Eaten**: Tracks grazing impact; overgrazing depletes tiles.
- **Pooped On**: Moderate manure fertilizes; excess increases disease risk.

#### Pasture Health Rule

Optimal pasture health requires:

- **1/3 Eaten**: Provides forage without depletion.
- **1/3 Trampled**: Improves soil structure.
- **1/3 Pooped On**: Enhances nutrient cycling.

### Disease

- Modeled using contact-based spread dynamics (inspired by NetLogo), with random chance based on proximity to manure-heavy tiles.
- Adjustable frequency for prototyping (via config file or settings).
- Impacts cow health, reducing weight and fertility.

### Economic System

- **Income**: Sell live animals (calves, cows, bulls) or meat, with prices based on cattle cycle models (e.g., USDA data, see links below).
- **Expenses**: Fencing, water infrastructure, hay, and livestock purchases.
- **Financial Details**: Taxes and maintenance costs included but simplified (e.g., flat annual tax). Loans are a post-MVP feature.
- **UI**: Detailed financial stats (e.g., revenue, expenses) available but collapsible for simplicity.

### Holistic Management

- **Grouped Grazing**: Cows must be grouped in paddocks to avoid selective grazing.
- **Rotational Grazing**: Players use a grazing planner (UI tool) modeled after the provided chart, scheduling herd movements by month and paddock with real-time updates.
- **Learning**: Players discover principles through trial and error, guided by planner tools.
- **Metrics**: Pasture health is the primary metric (placeholder for future soil carbon or biodiversity tracking).

## Gameplay Mechanics

- **Land Management**: Divide 30-acre plot (120,000 tiles) into paddocks using drag-and-drop electric fencing.
- **Herd Management**: Assign cows to paddocks, monitor stats, and manage breeding via a database-driven UI.
- **Grazing Planner**: UI mirrors the provided chart (left-to-right = months, top-to-bottom = paddocks), showing size, stocking rates, and animal days. Includes real-time data (growth rate, supplement feed, herd size, available paddocks, recovery periods, animal types) with visual indicators (e.g., color changes for paddock health). Automates rotations unless overridden.
- **Resource Allocation**: Balance money, feed, and infrastructure via menus.
- **Time Control**: Speed up/slow down simulation (e.g., 1 hour = 1 year).
- **Tile-Based System**: 1 tile = 1 square meter, tracks grass, manure, water availability, soil type, shade, and elevation (shade/elevation uninitialized for MVP).
- **Win/Loss**:
  - **Win**: Achieve target herd size and wealth (e.g., 20 cows, $10,000) in 5 years.
  - **Loss**: Bankruptcy, herd loss, or land degradation.

## Technical Details

- **Platform**: Browser-based (desktop-focused), using JavaScript and Phaser.js for 2D simulation.
- **Graphics**: Minimalist, ASCII or simple squares (Dwarf Fortress-like), designed for easy skinning.
- **Architecture**: Modular to support separate prototyping of dynamics (e.g., herd behavior, weather, terrain).
- **Database**: Stores individual cow stats (weight, fertility, health) and summarizes herd data.
- **Performance**: Optimized for real-time simulation on a 120,000-tile grid.
- **Save System**: Browser local storage for game progress.
- **Configurability**: Adjustable parameters (e.g., disease spread rate) via config files for prototyping.

## Stretch Goals (Post-MVP)

- **Land Scales**: 200, 1,000, 10,000 acres.
- **Weather/Seasons**: Drought, winter, and sun hours affect grass growth and cow behavior.
- **Genetics/Breeding**: Controlled bull-cow mating, genetic traits.
- **Labor**: Ranch hands to limit player capacity (Civilization-style).
- **Complex Dynamics**: Species-specific cows, mixed-species herds, advanced fencing, irrigation, plant species, stillbirths, poisoning.
- **Market Dynamics**: Trading, land sales, or breeding with other players (multiplayer).
- **Metrics**: Soil carbon, biodiversity tracking.

## Things to Avoid

- **Selective Grazing**: Ungrouped cows degrade pastures.
- **Overgrazing/Undergrazing**: Imbalances ruin sustainability.
- **Feces Overload**: Increases disease risk.
- **Resource Mismanagement**: Leads to bankruptcy or herd loss.

## Economic Data Sources

- **USDA Cattle Price Data**: https://www.ers.usda.gov/data-products/cattle-and-beef-statistics/
- **Cattle Cycle Model (System Dynamics)**: https://www.systemdynamics.org/system-dynamics-applications/agriculture/ (explore livestock models).

## Prototyping Plan

- **Order of Dynamics** (based on functionality and dependency):
  1. **Herd Behavior**: Agent-based movement, grazing, trampling, and collision detection with fences (MVP foundation, starting now).
  2. **Pasture Growth**: Tile-based grass growth and health, with regrowth-based recovery (builds on herd grazing/trampling).
  3. **Disease Spread**: Contact-based mechanics, using herd proximity and manure (depends on herd and pasture).
  4. **Economic System**: Basic market with cattle cycle pricing, integrating herd sales (requires herd data).
  5. **Grazing Planner UI**: Chart-based rotation scheduling with real-time updates and visual indicators (ties all mechanics together).
  6. **Weather/Terrain**: Separate prototype for drought and soil type effects (optional post-MVP integration).
  7. **Genetics/Labor**: Controlled breeding and ranch hand limits (post-MVP, after core mechanics).
- **Approach**: Each prototype isolates 1-2 dynamics, using ASCII/squares for graphics. Combine into an end-to-end system after validating individual mechanics.
- **Timeline**: Herd behavior prototype target completion: August 12, 2025, 05:50 PM EDT, with weekly updates.

## Sample Config File

- **File Name**: config.json
- **Content**:
  {
    "diseaseSpreadRate": 0.05, // Probability of disease spread per contact (0-1)
    "grassRegrowthRate": 0.02, // Daily growth fraction of grass biomass (0-1)
    "cowMovementSpeed": 5, // Tiles moved per minute
    "initialHerdSize": 10, // Starting number of cows
    "startingBudget": 50000, // Initial money in dollars
    "collisionDetection": true // Enable basic fence collision
  }
