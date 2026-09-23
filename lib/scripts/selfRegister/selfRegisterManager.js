import { MinecraftBlockTypes } from "@minecraft/vanilla-data";
import { sendSystemMessage } from "../util/util";
export class SelfRegisterManager {
    static registerComponent(startupEv) {
        startupEv.blockComponentRegistry.registerCustomComponent("edu:self_register_bottom", {
            onPlace: (ev) => this.onPlaceBottom(ev),
            onBreak: (ev) => this.onBreakBottom(ev),
        });
        startupEv.blockComponentRegistry.registerCustomComponent("edu:self_register_top", {
            onBreak: (ev) => this.onBreakTop(ev),
            onPlayerInteract: (ev) => this.onInteractTop(ev),
        });
    }
    static onPlaceBottom(ev) {
        const { block } = ev;
        const aboveBlock = block.above();
        const dir = block.permutation.getState("minecraft:cardinal_direction");
        if (aboveBlock === undefined || !aboveBlock.isAir) {
            sendSystemMessage(`[SelfRegisterManager onPlaceBottom] 上部のブロックが${aboveBlock === null || aboveBlock === void 0 ? void 0 : aboveBlock.typeId}です`);
            block.setType(MinecraftBlockTypes.Air);
            return;
        }
        if (dir === undefined) {
            sendSystemMessage("[SelfRegisterManager onPlaceBottom] 下部のブロックのcardinal_directionがundefinedです");
            return;
        }
        aboveBlock.setType("edu:self_register_top");
        const perm = aboveBlock.permutation;
        aboveBlock.setPermutation(perm.withState("minecraft:cardinal_direction", dir));
    }
    static onBreakBottom(ev) {
        const { block } = ev;
        const aboveBlock = block.above();
        if (aboveBlock === undefined || aboveBlock.typeId !== "edu:self_register_top") {
            sendSystemMessage(`[SelfRegisterManager onBreakBottom] 上部のブロックが${aboveBlock === null || aboveBlock === void 0 ? void 0 : aboveBlock.typeId}です`);
            block.setType(MinecraftBlockTypes.Air);
            return;
        }
        aboveBlock.setType(MinecraftBlockTypes.Air);
    }
    static onBreakTop(ev) {
        const { block } = ev;
        const belowBlock = block.below();
        if (belowBlock === undefined || belowBlock.typeId !== "edu:self_register") {
            sendSystemMessage(`[SelfRegisterManager onBreakTop] 下部のブロックが${belowBlock === null || belowBlock === void 0 ? void 0 : belowBlock.typeId}です`);
            block.setType(MinecraftBlockTypes.Air);
            return;
        }
        belowBlock.setType(MinecraftBlockTypes.Air);
    }
    static onInteractTop(ev) {
        const { block } = ev;
        const perm = block.permutation;
        const currentState = perm.getState("edu:monitor");
        if (typeof currentState !== "number") {
            sendSystemMessage(`[SelfRegisterManager onInteractTop] edu:monitorの型が${typeof currentState}です`);
            return;
        }
        const newState = currentState === 1 ? 2 : 1;
        block.setPermutation(perm.withState("edu:monitor", newState));
    }
}
//# sourceMappingURL=selfRegisterManager.js.map