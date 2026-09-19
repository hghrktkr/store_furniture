import { world } from "@minecraft/server";
import { isTestMode } from "../config/testMode";
export function sendSystemMessage(text) {
    if (isTestMode) {
        console.warn(`[test] ${text}`);
        world.sendMessage(`§c[test] ${text}`);
    }
}
export function getCardinalDirection(rotation) {
    const yaw = ((rotation.y % 360) + 360) % 360;
    if (yaw >= 315 || yaw < 45) {
        return "south";
    }
    if (yaw >= 45 && yaw < 135) {
        return "west";
    }
    if (yaw >= 135 && yaw < 225) {
        return "north";
    }
    return "east";
}
//# sourceMappingURL=util.js.map