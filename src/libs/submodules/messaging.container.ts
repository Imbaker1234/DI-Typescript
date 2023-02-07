import {IMessageRelay, MessageRelay} from '../messaging/message-relay';
import {IServiceProvider} from '../containers/service-provider.interface';
import {ILogger} from '../logging/logger.interface';
import {IMessageTimestampService, MessageTimestampService} from '../messaging/message-timestamp-service';
import {IMessageProcessor} from '../messaging/message-processor.interface';
import {MessageListener} from '../messaging/message-listener';
import {ServiceCollection} from '../containers/service-collection';
import {IServiceCollection} from '../containers/service-collection.interface';

export const MessagingContainer = (container: IServiceCollection): IServiceCollection => {

	container ??= new  ServiceCollection();

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
	return container;
}
