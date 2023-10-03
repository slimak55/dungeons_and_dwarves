import {dungeons_and_dwarves} from "./module/config.mjs"
import DnD_ItemSheet from "./module/sheets/DnD_ItemSheet.js"
import DnD_PcSheet from "./module/sheets/DnD_PcSheet.js"
import {DnD_Item} from "./module/documents/item.js"
import {DnD_Actor} from "./module/documents/actor.js"

Hooks.once("init",function(){
console.log("DnD Init Sequence");

	
	game.dungeons_and_dwarves = {
   	DnD_Item,
   	DnD_Actor

  };


	CONFIG.dungeons_and_dwarves = dungeons_and_dwarves;

	CONFIG.Item.documentClass = DnD_Item;
	CONFIG.Actor.documentClass = DnD_Actor;

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("DnD", DnD_ItemSheet, {makeDefault:true});

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("DnD", DnD_PcSheet, {makeDefault:true});

});
	