export default class DnD_PcSheet extends ActorSheet {
	get template() {
		return `systems/dungeons-and-dwarves/templates/sheets/${this.actor.type}-sheet.html`; }

		static get defaultOptions() {
    return mergeObject(super.defaultOptions, {

 			width: 1000,
 			height:1000,
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
			 context.items = actorData.items

			 context.notes = await TextEditor.enrichHTML(this.object.system.notes, {async: true});

			 context.actor_bio = await TextEditor.enrichHTML(this.object.system.bio, {async: true});
			 context.appearance = await TextEditor.enrichHTML(this.object.system.appearance, {async: true});

			if (actorData.type == 'PC') {
      this._prepareItems(context);
      //this._prepareCharacterData(context);
    }

    	if (actorData.type == 'Enemy') {
      this._prepareEnemyItems(context);
      //this._prepareCharacterData(context);
    }
 
			 return context;

			}

_prepareItems(context) {
	const inv = [];
	const skills = [];
	const eq_weapon = [];
	const eq_armor =  [];
		





	for (let i of context.items) {

      i.img = i.img || DEFAULT_TOKEN;
      // Append to weapons.
      if (i.type === 'melee_weapon' || i.type === 'range_weapon') {
      	if (i.system.eq === true) {
      		eq_weapon.push(i);
      	}
      	else {
      		inv.push(i);
      	}
      }
      // Append to weapons.
      if (i.type === 'armor') {
        	if (i.system.eq === true) {
      		eq_armor.push(i);
      	}
      	else {
      		inv.push(i);
      	}
      }
       // Append to spells.
      else if (i.type === 'spell' || i.type === 'skill') { 
          skills.push(i);
      }
      // Append to consumable.
      else if (i.type === 'consumable') {
        inv.push(i);
      }
    }


    context.inv = inv;
    context.eq_armor = eq_armor;
    context.eq_weapon = eq_weapon;
    context.skills = skills;
}

_prepareEnemyItems(context) {

	const inv = [];
	const skills = [];

	for (let i of context.items) {

      i.img = i.img || DEFAULT_TOKEN;
      // Append to weapons.
      if (i.type === 'melee_weapon' || i.type === 'range_weapon') {

      		inv.push(i);
      }
       // Append to spells.
      else if (i.type === 'spell' || i.type === 'skill') { 
          skills.push(i);
      }
      // Append to consumable.
      else if (i.type === 'consumable') {
        inv.push(i);
      }
    }






	 context.inv = inv;
	 context.skills = skills;
	}

	
 activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });
       // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

       // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const tr = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(tr.data("itemId"));
      item.delete();
      tr.slideUp(200, () => this.render(false));
    });

    const inputs = html.find("input");
    inputs.focus(ev => ev.currentTarget.select());
    inputs.addBack().find('[type="text"][data-dtype="Number"]').change(this._onChangeInputDelta.bind(this));


    html.find('.in-edit').change(this._onQuantityChange.bind(this));

    html.find('.rollable').click(this._onRoll.bind(this));

    html.find(".item-toggle").click(this._onToggleItem.bind(this));

    html.find('.in-edit-ammo1').change(this._onQuantityAmmo1Change.bind(this));

     html.find('.in-edit-ammo2').change(this._onQuantityAmmo2Change.bind(this));

	}

  _onToggleItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const attr = "system.eq";
    return item.update({[attr]: !foundry.utils.getProperty(item, attr)});
  }

	_onChangeInputDelta(event) {
    const input = event.target;
    const value = input.value;
    if ( ["+", "-"].includes(value[0]) ) {
      const delta = parseFloat(value);
      const item = this.actor.items.get(input.closest("[data-item-id]")?.dataset.itemId);
      if ( item ) input.value = Number(foundry.utils.getProperty(item, input.dataset.name)) + delta;
      else input.value = Number(foundry.utils.getProperty(this.actor, input.name)) + delta;
    } else if ( value[0] === "=" ) input.value = value.slice(1);
  }


  async _onQuantityChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const quantity = Math.max(0, parseInt(event.target.value));
    event.target.value = quantity;
    return item.update({"system.quantity": quantity});
  }

    async _onQuantityAmmo1Change(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const quantity = Math.max(0, parseInt(event.target.value));
    event.target.value = quantity;
    return item.update({"system.ammo_count_1": quantity});
  }

    async _onQuantityAmmo2Change(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const quantity = Math.max(0, parseInt(event.target.value));
    event.target.value = quantity;
    return item.update({"system.ammo_count_2": quantity});
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

