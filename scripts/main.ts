import { StartupEvent, system } from "@minecraft/server";
import { WalkInCoolerManager } from "./walkInCooler/walkInCoolerManager";
import { sendSystemMessage } from "./util/util";
import { DisplayManager } from "./display/displayManager";
import { ShoppingBasketManager } from "./shoppingBasket/shoppingBasketManager";

// カスタムコンポーネント登録
system.beforeEvents.startup.subscribe((ev: StartupEvent) => {
  WalkInCoolerManager.registerComponent(ev);
  DisplayManager.registerComponent(ev);
  ShoppingBasketManager.registerComponent(ev);
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  sendSystemMessage(`id: ${ev.id}, entity: ${ev.sourceEntity}`);
});
