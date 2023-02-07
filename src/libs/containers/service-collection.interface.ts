import {Lifetime} from '../Lifetimes.enum';
import {IServiceProvider} from './service-provider.interface';

export interface IServiceCollection {
	register<T>(key: string, factory: (c: IServiceProvider) => T, lifetime: Lifetime): void;

	register<T>(key: string, factory: (c: IServiceProvider) => T): void;

	buildServiceProvider(): IServiceProvider;
}
