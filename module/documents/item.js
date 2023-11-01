export class DnD_Item extends Item {

  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    const flags = itemData.flags.dungeons_and_dwarves || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareArmourData(itemData);
  }

  _prepareArmourData(itemData) {
    if (itemData.type !== 'armor') return;
    const systemData = itemData.system;
    systemData.ac_full = systemData.ac_armor + systemData.ac_mod;
  }


  getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }
}