import {Lifetime} from '../Lifetimes.enum';
import {IServiceProvider} from './service-provider.interface';
import {ServiceRegistry} from './service-registry';
import {IServiceCollection} from './service-collection.interface';
import {ServiceProvider} from './service-provider';

export class ServiceCollection implements IServiceCollection, IServiceProvider {
	// eslint-disable-next-line @typescript-eslint/ban-types
	private services: ServiceRegistry;
	// eslint-disable-next-line @typescript-eslint/ban-types
	private scopedServices: ServiceRegistry;


	constructor(baseContainer: ServiceCollection | null = null) {
		this.services = baseContainer?.services ?? new ServiceRegistry();
		this.scopedServices = (baseContainer?.scopedServices ?? new ServiceRegistry()).clone().clear();
	}

	register<T>(key: string, factory: (c: IServiceProvider) => T, lifetime: Lifetime = Lifetime.Transient): void {
		const blindFactoryMethod = factory as (c: IServiceProvider) => never;
		if (lifetime === Lifetime.Scoped) {
			this.scopedServices.set(({key, factory: blindFactoryMethod, lifetime, instance: null}));
		}
		this.services.set(({key, factory: blindFactoryMethod, lifetime, instance: null}));
	}

	private GetOrCacheInstance(registry: ServiceRegistry, key: string) {
		const descriptor = registry.get(key);
		if (!descriptor?.instance) {
			descriptor.instance = descriptor.factory(this);
		}
		return descriptor.instance;
	}

	public resolve<T>(key: string): T {
		const entry = this.services.get(key);
		if (!entry) {
			throw new Error(`Service with key "${key}" not found`);
		}

		switch (entry.lifetime) {
		case Lifetime.Singleton: {
			return this.GetOrCacheInstance(this.services, key);
		}
		case Lifetime.Scoped: {
			return this.GetOrCacheInstance(this.scopedServices, key);
		}
		case Lifetime.Transient:
		default:
			return entry.factory(this);
		}
	}

	public createScope(cb: (container: IServiceProvider) => void): void {
		const scopedContainer = new ServiceCollection();
		scopedContainer.services = this.services;
		scopedContainer.scopedServices = this.scopedServices.clone().clear();
		cb(scopedContainer);
	}

	public buildServiceProvider(): IServiceProvider {
		return new ServiceProvider(this.services, this.scopedServices);
	}
}
