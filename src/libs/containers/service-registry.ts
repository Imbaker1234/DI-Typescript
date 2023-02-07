import {IServiceDescriptor} from './service-descriptor';

export class ServiceRegistry {
	private store: any = {};

	get(key: string): IServiceDescriptor {
		return (this.store as any)[key];
	}

	set(descriptor: IServiceDescriptor): void {
		(this.store as any)[descriptor.key] = descriptor;
	}

	clone(): ServiceRegistry {
		return Object.values(this.store).reduce((acc: ServiceRegistry, value) => {
			acc.set(value as IServiceDescriptor);
			return acc;
		}, new ServiceRegistry());
	}

	clear(): ServiceRegistry {
		(Object.values(this.store) as IServiceDescriptor[]).forEach((descriptor: IServiceDescriptor) => {
			return descriptor.instance = null;
		});
		return this;
	}
}
