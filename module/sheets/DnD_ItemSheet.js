export default class DnD_ItemSheet extends ItemSheet {
	get template() {
		return `systems/dungeons-and-dwarves/templates/sheets/${this.item.type}-sheet.html`; 
	}
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 700
		});
	}
	async getData() {

		const context = super.getData();
		const itemData = context.item;

		context.config = CONFIG.dungeons_and_dwarves;
		context.system = itemData.system;
		context.flags = itemData.flags;

		context.item.info = await TextEditor.enrichHTML(this.object.system.info, {async: true})

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html);
    // Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;
    // Roll handlers, click handlers, etc. would go here.
	}
}

