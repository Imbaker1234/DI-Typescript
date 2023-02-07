import {IMessageRelay, MessageRelay} from '../libs/messaging/message-relay';
import {IMessageTimestampService, MessageTimestampService} from '../libs/messaging/message-timestamp-service';
import {IMessageProcessor} from '../libs/messaging/message-processor.interface';
import {MessageListener} from '../libs/messaging/message-listener';
import {ILogger} from '../libs/logging/logger.interface';
import {IServiceProvider} from '../libs/containers/service-provider.interface';
import {ServiceCollection} from '../libs/containers/service-collection';
import {ConsoleLogger} from '../libs/logging/console.logger';
import {TraceLogger} from '../libs/logging/trace.logger';
import {BrokenUuidFactory} from '../libs/factory/broken.guid.factory';
import {IFactory} from '../libs/factory/factory.interface';
import {UuidFactory} from '../libs/factory/guid.factory';
import {Lifetime} from '../libs/Lifetimes.enum';
import {IServiceCollection} from '../libs/containers/service-collection.interface';
import {MessageIsoService} from '../libs/messaging/message-iso.service';
import {baseContainer} from '../libs/submodules/base.container';
import {MessagingContainer} from '../libs/submodules/messaging.container';
import {demonstrate} from './demonstrate';

export const demonstrations = [
	{
		/**
		 * A simple demonstration of a three tiered dependency graph.
		 */
		execute: () => {
			/**
			 *  Instantiating the Service Collection. This is where we register all of the classes, services,
			 * and other elements that will be used in our application.
			 * */
			const container: IServiceCollection = new ServiceCollection();

			/**
			 * Our first registration. Written out on two lines to illustrate what's happening.
			 */
			container.register<ILogger> /** This Generic Type provides validation when developing and type-casting when running */
			(
				'ILogger', /** This is the actual key that is used to look up the dependency. */

				() => new ConsoleLogger() /** This function is the recipe for making our dependency. It must return our Generic Type. */
			);


			/**
			 * In our second registration we're doing something a little more advanced. We're passing in a function
			 * which takes a ServiceProvider (The eventual output that the Service Container becomes).
			 */
			container.register<IMessageRelay>(
				'IMessageRelay',

				(sp: IServiceProvider) => new MessageRelay(sp.resolve<ILogger>('ILogger')));

			container.register<IMessageTimestampService>(
				'IMessageTimestampService',
				(sp: IServiceProvider) => new MessageTimestampService(
					sp.resolve<IMessageProcessor>('IMessageRelay'),
					sp.resolve<ILogger>('ILogger'))
			);

			container.register<MessageListener>(
				'MessageListener',
				(sp: IServiceProvider) =>
					new MessageListener(
						sp.resolve<IMessageProcessor>('IMessageTimestampService'),
						sp.resolve<ILogger>('ILogger'))
			);

			/**
			 *  Here we convert our container from a ServiceCollection to a ServiceProvider. No longer do we have access to the
			 *  registration methods. Instead we are now able to start using our recipes, executing our generator functions,
			 *  and running our application!
			 */
			const provider = container.buildServiceProvider();

			provider.createScope((sp: IServiceProvider) => {

				const messageHandler = sp.resolve<MessageListener>('MessageListener');
				messageHandler.process({message: 'Hello World!'});
				console.log('Demo Completed');
			});
		}
	},
	{
		/**
		 * An example of Logger injection using DI.
		 */
		execute: () => {

			const container: IServiceCollection = new ServiceCollection();

			container.register<IFactory<string>>('UuidFactory', () => new BrokenUuidFactory());

			container.register<ILogger>('ILogger', (c: IServiceProvider) => {
				const uuid = c.resolve<IFactory<string>>('UuidFactory').createInstance();
				return new TraceLogger(uuid);
			});

			container.register<IMessageRelay>('IMessageRelay', (c: IServiceProvider) => new MessageRelay(c.resolve<ILogger>('ILogger')));

			container.register<IMessageTimestampService>(
				'IMessageTimestampService',
				(c: IServiceProvider) => new MessageTimestampService(
					c.resolve<IMessageProcessor>('IMessageRelay'),
					c.resolve<ILogger>('ILogger'))
			);

			container.register<MessageListener>(
				'MessageListener',
				(c: IServiceProvider) =>
					new MessageListener(
						c.resolve<IMessageProcessor>('IMessageTimestampService'),
						c.resolve<ILogger>('ILogger'))
			);

			const provider = container.buildServiceProvider();

			provider.createScope((sp: IServiceProvider) => {

				const messageHandler = sp.resolve<MessageListener>('MessageListener');
				messageHandler.process({message: 'Hello World!'});
				console.log('Demo Completed');
			});
			demonstrate(provider, 2);
		}
	},
	{
		/**
		 * An example showing how we can fix this bug while still retaining the Open-Closed principle.
		 */
		execute: () => {

			const container: IServiceCollection = new ServiceCollection();

			container.register<IFactory<string>>('UuidFactory', () => new UuidFactory());

			container.register<ILogger>('ILogger', (c: IServiceProvider) => {
				const uuid = c.resolve<IFactory<string>>('UuidFactory').createInstance();
				return new TraceLogger(uuid);
			});

			container.register<IMessageRelay>('IMessageRelay', (c: IServiceProvider) => new MessageRelay(c.resolve<ILogger>('ILogger')));

			container.register<IMessageTimestampService>(
				'IMessageTimestampService',
				(c: IServiceProvider) => new MessageTimestampService(
					c.resolve<IMessageProcessor>('IMessageRelay'),
					c.resolve<ILogger>('ILogger'))
			);

			container.register<MessageListener>(
				'MessageListener',
				(c: IServiceProvider) =>
					new MessageListener(
						c.resolve<IMessageProcessor>('IMessageTimestampService'),
						c.resolve<ILogger>('ILogger'))
			);

			const provider = container.buildServiceProvider();
			demonstrate(provider, 3);
		}
	},
	{
		/**
		 * A demonstration showing how we can take advantage of varying scope lifetimes to provide
		 * a variety of effects, from caching to context tracing and more, without coupling our
		 * dependent classes or even making them aware of one another.
		 */
		execute: () => {

			const container: IServiceCollection = new ServiceCollection();

			container.register<IFactory<string>>('UuidFactory', () => new UuidFactory());

			container.register<ILogger>('ILogger', (c: IServiceProvider) => {
				const uuid = c.resolve<IFactory<string>>('UuidFactory').createInstance();
				return new TraceLogger(uuid);
			}, Lifetime.Scoped);

			container.register<IMessageRelay>('IMessageRelay', (c: IServiceProvider) => new MessageRelay(c.resolve<ILogger>('ILogger')));

			container.register<IMessageTimestampService>(
				'IMessageTimestampService',
				(c: IServiceProvider) => new MessageTimestampService(
					c.resolve<IMessageProcessor>('IMessageRelay'),
					c.resolve<ILogger>('ILogger'))
			);

			container.register<MessageListener>(
				'MessageListener',
				(c: IServiceProvider) =>
					new MessageListener(
						c.resolve<IMessageProcessor>('IMessageTimestampService'),
						c.resolve<ILogger>('ILogger'))
			);

			const provider = container.buildServiceProvider();
			demonstrate(provider, 4);
		}
	},
	{
		/**
		 * In this example we leverage a series of containers which provide us with handy defaults for our common dependencies.
		 * With this we can keep our containers DRY while still retaining the ability to override certain portions of the
		 * pre-defined registrations.
		 *
		 * Here we re-register a dependency that was already registered in a sub-container. Allowing us to only override what
		 * we absolutely must.
		 */
		execute: () => {

			let container: IServiceCollection = baseContainer();
			container = MessagingContainer(container);

			container.register<MessageIsoService>(
				'MessageIsoService', (sp) => new MessageIsoService(
					sp.resolve<IMessageTimestampService>('IMessageTimestampService'),
					sp.resolve<ILogger>('ILogger')
				));

			container.register<MessageListener>(
				'MessageListener',
				(c: IServiceProvider) => new MessageIsoService(
					c.resolve<MessageIsoService>('MessageIsoService'),
					c.resolve<ILogger>('ILogger'))
			);

			const provider = container.buildServiceProvider();
			demonstrate(provider, 5);
		}
	},
	{
		/**
		 * In this example we leverage a series of containers which provide us with handy defaults for our common dependencies.
		 * With this we can keep our containers DRY while still retaining the ability to override certain portions of the
		 * pre-defined registrations.
		 */

		execute: () => {

			let container: IServiceCollection = baseContainer();
			container = MessagingContainer(container);
			container.register<MessageIsoService>(
				'MessageIsoService',
				(c: IServiceProvider) => new MessageIsoService(
					c.resolve<IMessageTimestampService>('IMessageTimestampService'),
					c.resolve<ILogger>('ILogger'))
			);

			const provider = container.buildServiceProvider();
			demonstrate(provider, 6);
		}
	}
]
