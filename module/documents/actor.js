export class DnD_Actor extends Actor {

 prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.dungeons_and_dwarves || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
    this._prepareEnemyData(actorData);
  }

_prepareCharacterData(actorData) {
	if (actorData.type !== 'PC') return;

	const systemData = actorData.system;
	systemData.abilities.str.mod = Math.floor((systemData.abilities.str.value - 10) / 2);
	systemData.abilities.dex.mod = Math.floor((systemData.abilities.dex.value - 10) / 2);
	systemData.abilities.int.mod = Math.floor((systemData.abilities.int.value - 10) / 2);
	systemData.abilities.cha.mod = Math.floor((systemData.abilities.cha.value - 10) / 2);
	systemData.abilities.per.mod = Math.floor((systemData.abilities.per.value - 10) / 2);

}
_prepareNpcData(actorData){}
_prepareEnemyData(actorData){}



  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);
    this._getEnemyData(data);



    return data;
  }

 _getCharacterRollData(data) {
    if (this.type !== 'character') return;

     if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }


}
_getNpcRollData(data) {}
_getEnemyData(data){}


}