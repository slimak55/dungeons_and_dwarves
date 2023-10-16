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
  //Ability Modifiers
  if (systemData.abilities.str.proficient === false) {
    systemData.abilities.str.mod = Math.floor((systemData.abilities.str.value - 10) / 2);
  }
  else {

    const pro_value = systemData.abilities.str.value + systemData.pro_bonus;
    systemData.abilities.str.mod = Math.floor((pro_value - 10) / 2);
  }
  if (systemData.abilities.dex.proficient === false) {
    systemData.abilities.dex.mod = Math.floor((systemData.abilities.dex.value - 10) / 2);
    
  }
  else {

    const pro_value = systemData.abilities.dex.value + systemData.pro_bonus;
    systemData.abilities.dex.mod = Math.floor((pro_value - 10) / 2);
  }
   if (systemData.abilities.int.proficient === false) {
    systemData.abilities.int.mod = Math.floor((systemData.abilities.int.value - 10) / 2);
    
  }
  else {

    const pro_value = systemData.abilities.int.value + systemData.pro_bonus;
    systemData.abilities.int.mod = Math.floor((pro_value - 10) / 2);
  }


  systemData.abilities.cha.mod = Math.floor((systemData.abilities.cha.value - 10) / 2);
  systemData.abilities.per.mod = Math.floor((systemData.abilities.per.value - 10) / 2);

 
  // Movement by class type

  if (systemData.details.class_type === "str" || systemData.details.class_type === "int") {

    systemData.attributes.movement_speed = 25;
     //Movement seconds Math
     systemData.attributes.movement_sec = systemData.attributes.movement_speed / 5;

  }
  else if (systemData.details.class_type === "dex") {

      systemData.attributes.movement_speed = 35;
       //Movement seconds Math
      systemData.attributes.movement_sec = systemData.attributes.movement_speed / 5;

  }
  else {

   systemData.attributes.movement_speed = 30;
    //Movement seconds Math
  systemData.attributes.movement_sec = systemData.attributes.movement_speed / 5;

  }





  // Max Mana and HP dice
    if(systemData.levels === 1){
    systemData.hp_dice.max = 1;

    if (systemData.details.class_type === "dex" || systemData.details.class_type === "str"){

      systemData.mana_dice.max = 0;
    }
    else{
       systemData.mana_dice.max = 1;
    }
   

  }
  else{

    systemData.hp_dice.max = Math.floor(systemData.levels / 2);

     if (systemData.details.class_type === "dex" || systemData.details.class_type === "str"){

       systemData.mana_dice.max = 0; 
     }
     else{

       systemData.mana_dice.max = Math.floor(systemData.levels / 2); 

     }

  }
 
// Mana / HP dice types

  if (systemData.details.class_type === "str") {
      systemData.hp_dice_type = "1d10"
      systemData.mana_dice_type = "None"
    }
  else if (systemData.details.class_type === "dex") {
      systemData.hp_dice_type = "1d8"
      systemData.mana_dice_type = "None"
    }
   else if (systemData.details.class_type === "mixed") {
      systemData.hp_dice_type = "1d8"
      systemData.mana_dice_type = "1d8*25"
    }
  else if (systemData.details.class_type === "int") {
      systemData.hp_dice_type = "1d6"
      systemData.mana_dice_type = "1d12*25"
    }



 //Level Cost
    this.system.level = systemData.levels;
  
    const xp = this.system.xp;
    xp.max = this.getLevelExp(this.system.level || 1);
    const prior = this.getLevelExp(this.system.level - 1 || 0);
    const required = xp.max - prior;
    const pct = Math.round((xp.value - prior) * 100 / required);
    xp.pct = Math.clamped(pct, 0, 100);

//AC Class
    let ac_armorfull = 10;
    let ac_armor_type = "";

    for (const armorItem of this.itemTypes.armor) {
        if (armorItem.system.eq) {
          ac_armorfull = parseInt(armorItem.system.ac_full || '10')
         ac_armor_type += armorItem.system.armor_type || '0'
        }
      }

      if (ac_armor_type === "light") {
         systemData.attributes.ac = ac_armorfull + systemData.ac_bonus + systemData.abilities.dex.mod;

      }
      else if (ac_armor_type === "medium") {

        if (systemData.abilities.dex.mod > 2) {

          systemData.attributes.ac = ac_armorfull + systemData.ac_bonus + 2;
        }
        else{

          systemData.attributes.ac = ac_armorfull + systemData.ac_bonus + systemData.abilities.dex.mod;

        }

      }
      else if (ac_armor_type === "heavy") {

        systemData.attributes.ac = ac_armorfull + systemData.ac_bonus;

      }
      else {

         systemData.attributes.ac = ac_armorfull + systemData.ac_bonus + systemData.abilities.dex.mod;

      }
     
     // Inv item count
      let item_count = 0;
      for (const i of this.items) {
        if (i.type === 'melee_weapon' || i.type === 'range_weapon' || i.type === 'armor') {
          if (i.system.eq === true) {
            item_count += 0;

          }
          else {
            item_count += 1;

          }

        }
        else if (i.type === 'spell' || i.type === 'skill') { item_count += 0;}
        else{ item_count += 1;}
        
      }

    if(systemData.inv_size === "tiny" && item_count > 10 ){
     systemData.inv_count = "Overlimit" +"("+ item_count + ")";
    }
    else if(systemData.inv_size === "small" && item_count > 15 ){
     systemData.inv_count = "Overlimit" +"("+ item_count + ")";
    }
    else if (systemData.inv_size === "medium" && item_count > 25 ) {
      systemData.inv_count = "Overlimit" +"("+ item_count + ")";
    }
    else if (systemData.inv_size === "big" && item_count > 50 ) {
      systemData.inv_count = "Overlimit" +"("+ item_count + ")";
    }
    else{

       systemData.inv_count = item_count;

    }



}
_prepareNpcData(actorData){}
_prepareEnemyData(actorData){ 
    if (actorData.type !== 'Enemy') return;
    const systemData = actorData.system;

  systemData.abilities.str.mod = Math.floor((systemData.abilities.str.value - 10) / 2);
  systemData.abilities.dex.mod = Math.floor((systemData.abilities.dex.value - 10) / 2);
  systemData.abilities.int.mod = Math.floor((systemData.abilities.int.value - 10) / 2);
  systemData.abilities.cha.mod = Math.floor((systemData.abilities.cha.value - 10) / 2);
  systemData.abilities.per.mod = Math.floor((systemData.abilities.per.value - 10) / 2);
  systemData.attributes.movement.sec = systemData.attributes.movement.walk / 5;
}



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


 getLevelExp(level) {
    const levels = CONFIG.dungeons_and_dwarves.CHARACTER_EXP_LEVELS;
    return levels[Math.min(level, levels.length - 1)];
  }


}
 
