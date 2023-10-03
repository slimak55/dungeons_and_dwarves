export default class DnD_PcSheet extends ActorSheet {
	get template() {
		return `systems/dungeons_and_dwarves/templates/sheets/${this.actor.type}-sheet.html`; }

		static get defaultOptions() {
    return mergeObject(super.defaultOptions, {

 			width: 1000,
 			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
   

    });
  }


  	async getData() {

			 const context = super.getData();

			 const actorData = this.actor.toObject(false);

    		// Add the actor's data to context.data for easier access, as well as flags.
    		context.system = actorData.system;
    		context.flags = actorData.flags;
			 context.config = CONFIG.dungeons_and_dwarves;

			if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }



			 return context;

			}




	
 activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });


      html.find('.rollable').click(this._onRoll.bind(this));

	}

  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}

