export default class DnD_PcSheet extends ActorSheet {
	get template() {
		return `systems/dungeons_and_dwarves/templates/sheets/${this.actor.type}-sheet.html`; }

		static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
 			 width: 1000
   

    });
  }


  	async getData() {

			 const context = super.getData();

			 const actorData = this.actor.toObject(false);

    		// Add the actor's data to context.data for easier access, as well as flags.
    		context.system = actorData.system;
    		context.flags = actorData.flags;
			 context.config = CONFIG.dungeons_and_dwarves;

			 return context;

			}




	

	
}

