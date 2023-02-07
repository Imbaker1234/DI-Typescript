import {IFactory} from './factory.interface';

export class BrokenUuidFactory implements IFactory<string> {
	createInstance(): string {
		return 'Not-A-Valid-GUID';
	}
}
