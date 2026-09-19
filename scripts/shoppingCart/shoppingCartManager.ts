import {
  BlockComponentPlayerInteractEvent,
  Entity,
  PlayerInteractWithEntityAfterEvent,
  StartupEvent,
  system,
  Vector3,
  world,
} from "@minecraft/server";
import { getCardinalDirection, sendSystemMessage } from "../util/util";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

export class ShoppingCartManager {
  static readonly map: Map<string, Entity> = new Map(); // <playerId, cartEntity>

  static registerComponent(startupEv: StartupEvent) {
    startupEv.blockComponentRegistry.registerCustomComponent("edu:shopping_cart_block", {
      onPlayerInteract: (ev) => this.onInteractBlock(ev),
    });

    system.runInterval(() => this.update(), 1);
  }

  static onInteractBlock(ev: BlockComponentPlayerInteractEvent) {
    const { block, dimension, player } = ev;
    if (!player) {
      sendSystemMessage("[onInteractBlock] プレイヤーがundefinedです");
      return;
    }

    // プレイヤーの前にエンティティを召喚して登録
    // 既に登録されていないかチェック
    if (this.map.has(player.id)) {
      sendSystemMessage(`[onInteractBlock] すでにプレイヤー${player.nameTag}はカートを持っています`);
      return;
    }

    const dir = player.getViewDirection();
    const rot = player.getRotation();
    const spawnLoc: Vector3 = {
      x: player.location.x + dir.x,
      y: player.location.y,
      z: player.location.z + dir.z,
    };

    block.setType(MinecraftBlockTypes.Air);

    system.run(() => {
      const entity = dimension.spawnEntity("edu:shopping_cart_entity", spawnLoc);
      entity.setRotation(rot);

      this.map.set(player.id, entity);
    });
  }

  static update() {
    for (const [playerId, cart] of this.map) {
      const player = world.getPlayers().find((p) => p.id === playerId);

      if (!player) {
        this.map.delete(playerId);
        continue;
      }

      if (!cart.isValid) {
        this.map.delete(playerId);
        continue;
      }

      const dir = player.getViewDirection();
      const rot = player.getRotation();
      const tpLoc: Vector3 = {
        x: player.location.x + dir.x,
        y: player.location.y,
        z: player.location.z + dir.z,
      };

      cart.teleport(tpLoc);
      cart.setRotation(rot);
    }
  }

  static onInteractEntity(ev: PlayerInteractWithEntityAfterEvent) {
    const { player, target } = ev;
    const cart = this.map.get(player.id);

    if (cart === undefined || target.id !== cart.id) {
      sendSystemMessage("[onInteractEntity] インタラクトしたカートが登録されているものと一致しません");
      return;
    }

    const setLoc = target.location;
    const rot = target.getRotation();
    const dir = getCardinalDirection(rot);

    const block = player.dimension.getBlock(setLoc);
    if (block === undefined || !block.isAir) {
      sendSystemMessage("[onInteractEntity] 指定した座標のブロックがundefinedまたは空気ではありません");
      return;
    }

    system.run(() => {
      block.setType("edu:shopping_cart");
      const perm = block.permutation;
      block.setPermutation(perm.withState("minecraft:cardinal_direction", dir));
      target.remove();
      this.map.delete(player.id);
    });
  }
}
