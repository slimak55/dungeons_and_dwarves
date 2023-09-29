import {dungeons_and_dwarves} from "./module/config.mjs"
import DnD_ItemSheet from "./module/sheets/DnD_ItemSheet.js"

Hooks.once("init",function(){
console.log("DnD Init Sequence");

	CONFIG.dungeons_and_dwarves = dungeons_and_dwarves;

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("DnD", DnD_ItemSheet, {makeDefault:true});

});
	