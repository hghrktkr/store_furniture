import { Vector2, world } from "@minecraft/server";
import { isTestMode } from "../config/testMode";

export function sendSystemMessage(text: string): void {
  if (isTestMode) {
    console.warn(`[test] ${text}`);
    world.sendMessage(`§c[test] ${text}`);
  }
}

type CardinalDirection = "north" | "south" | "east" | "west";

export function getCardinalDirection(rotation: Vector2): CardinalDirection {
  const yaw = ((rotation.y % 360) + 360) % 360;

  if (yaw >= 315 || yaw < 45) {
    return "north";
  }

  if (yaw >= 45 && yaw < 135) {
    return "east";
  }

  if (yaw >= 135 && yaw < 225) {
    return "south";
  }

  return "west";
}
