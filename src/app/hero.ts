let nextId = 30;

interface IHeroOptions {
	id?: number, name?: string, power?: string, alterEgo?: string
}

export class Hero {

	constructor(options: string | IHeroOptions, private _id?: number) {
		if (typeof options === 'string') {
			this.name = options;
		} else {
			this._id = options.id;
			this.name = options.name || '';
			this.power = options.power;
			this.alterEgo = options.alterEgo;
		}
		if (this._id == null) {
			this._id = nextId++;
		}
	}
	get id() { return this._id; }
	name: string;
	power: string;
	alterEgo:string;

	clone() {
		return new Hero(this);
	}

	static setNextId(next:number) {
		nextId = next;
	}
}
