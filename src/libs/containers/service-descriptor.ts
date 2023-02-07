import {IServiceProvider} from './service-provider.interface';
import {Lifetime} from '../Lifetimes.enum';

export interface IServiceDescriptor {
	key: string;
	factory: (c: IServiceProvider) => never;
	lifetime: Lifetime;
	instance: any;
}
