import {IFactory} from './factory.interface';

export class SimpleFactory<T> implements IFactory<T> {
	type: new () => T;

	constructor(type: new () => T) {
		this.type = type;
	}

	createInstance(): T {
		return new this.type();
	}
}
