import {Lifetime} from '../Lifetimes.enum';
import {IServiceProvider} from './service-provider.interface';
import {ServiceRegistry} from './service-registry';
import {ServiceCollection} from './service-collection';

export class ServiceProvider implements IServiceProvider {
	// eslint-disable-next-line @typescript-eslint/ban-types
	private services: ServiceRegistry;
	// eslint-disable-next-line @typescript-eslint/ban-types
	private scopedServices: ServiceRegistry;

	constructor(services: ServiceRegistry, scopedServices: ServiceRegistry) {
		this.services = services ?? new ServiceRegistry();
		this.scopedServices = scopedServices ?? new ServiceRegistry();
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
		const scopedContainer = new ServiceCollection(this as any);
		cb(scopedContainer);
	}
}
