export default class DnD_ItemSheet extends ItemSheet {
	get template() {
		return `systems/dungeons_and_dwarves/templates/sheets/${this.item.type}-sheet.html`; }

		async getData() {

			 const context = super.getData();
			 const itemData = context.item;

			context.config = CONFIG.dungeons_and_dwarves;

			return context;

		}
	
}

