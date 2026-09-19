import { EntityComponentTypes, ItemStack, } from "@minecraft/server";
import { sendSystemMessage } from "../util/util";
export class ShoppingBasketManager {
    static registerComponent(startupEv) {
        startupEv.itemComponentRegistry.registerCustomComponent("edu:on_interact", {
            onUseOn: (ev) => this.onUseShoppingBasket(ev),
        });
        startupEv.blockComponentRegistry.registerCustomComponent("edu:shopping_basket_stand", {
            onBreak: (ev) => this.onBreakShoppingBasketStand(ev),
        });
    }
    static onBreakShoppingBasketStand(ev) {
        const { brokenBlockPermutation, block } = ev;
        const amount = brokenBlockPermutation.getState("edu:basket_count");
        if (typeof amount !== "number")
            return;
        const spawnLoc = block.location;
        const basketItem = new ItemStack("edu:shopping_basket", amount);
        block.dimension.spawnItem(basketItem, spawnLoc);
    }
    static onUseShoppingBasket(ev) {
        const { source } = ev;
        const looking = source.getBlockFromViewDirection({ maxDistance: 7 });
        if (looking === undefined) {
            sendSystemMessage("[onUseShoppingBasket] 選択しているブロックがありません");
            return;
        }
        const lookingBlock = looking.block;
        const aboveBlock = lookingBlock.above();
        const lookingFaceLoc = looking.faceLocation;
        sendSystemMessage(`[ShoppingBasketManager] lookingFaceLoc: (${lookingFaceLoc.x}, ${lookingFaceLoc.y}, ${lookingFaceLoc.z})`);
        // edu:shopping_basket_standに向けている場合はstateの変更へ
        if (lookingBlock.typeId === "edu:shopping_basket_stand") {
            this.changeState(source, lookingBlock);
            return;
        }
        if (!aboveBlock || !aboveBlock.isAir) {
            sendSystemMessage("[onUseShoppingBasket] 設置予定の位置がundefined又は空気ではありません");
            sendSystemMessage(`[onUseShoppingBasket] ${aboveBlock === null || aboveBlock === void 0 ? void 0 : aboveBlock.typeId}`);
            return;
        }
        aboveBlock.setType("edu:shopping_basket_stand");
        this.consumeBasket(source);
    }
    static consumeBasket(player) {
        var _a;
        const container = (_a = player.getComponent(EntityComponentTypes.Inventory)) === null || _a === void 0 ? void 0 : _a.container;
        if (container === undefined)
            return;
        const slot = player.selectedSlotIndex;
        const selectedItem = container.getItem(slot);
        if (selectedItem === undefined)
            return;
        if (selectedItem.amount === 1) {
            container.setItem(slot, undefined);
        }
        else {
            selectedItem.amount--;
            container.setItem(slot, selectedItem);
        }
    }
    static changeState(player, basket) {
        const perm = basket.permutation;
        const currentState = perm.getState("edu:basket_count");
        if (typeof currentState !== "number")
            return;
        if (currentState < 5) {
            basket.setPermutation(perm.withState("edu:basket_count", currentState + 1));
            this.consumeBasket(player);
            return;
        }
    }
}
//# sourceMappingURL=shoppingBasketManager.js.map