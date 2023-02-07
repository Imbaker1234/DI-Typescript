import {ServiceCollection} from '../containers/service-collection';
import {IFactory} from '../factory/factory.interface';
import {UuidFactory} from '../factory/guid.factory';
import {ILogger} from '../logging/logger.interface';
import {IServiceProvider} from '../containers/service-provider.interface';
import {TraceLogger} from '../logging/trace.logger';
import {Lifetime} from '../Lifetimes.enum';
import {IServiceCollection} from '../containers/service-collection.interface';

export const baseContainer = (container?: IServiceCollection): IServiceCollection => {

	container ??= new ServiceCollection();

	container.register<IFactory<string>>('UuidFactory', () => new UuidFactory());

	container.register<ILogger>('ILogger', (c: IServiceProvider) => {
		const uuid = c.resolve<IFactory<string>>('UuidFactory').createInstance();
		return new TraceLogger(uuid);
	}, Lifetime.Scoped);

	return container;
}
