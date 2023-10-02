import {dungeons_and_dwarves} from "./module/config.mjs"
import DnD_ItemSheet from "./module/sheets/DnD_ItemSheet.js"
import DnD_PcSheet from "./module/sheets/DnD_PcSheet.js"

Hooks.once("init",function(){
console.log("DnD Init Sequence");

	CONFIG.dungeons_and_dwarves = dungeons_and_dwarves;

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("DnD", DnD_ItemSheet, {makeDefault:true});

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("DnD", DnD_PcSheet, {makeDefault:true});

});
	