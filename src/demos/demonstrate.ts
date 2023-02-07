import {IServiceProvider} from '../libs/containers/service-provider.interface';
import {MessageListener} from '../libs/messaging/message-listener';

/**
 * A static, as in unchanging, test harness showing how we can manipulate events
 * without altering code.
 * @param sp
 */
export const demonstrate = (sp: IServiceProvider, demoId: number) => {
	sp.createScope((scopedProvider: IServiceProvider) => {
		console.log('Enter Scope 1');
		const messageHandler = scopedProvider.resolve<MessageListener>('MessageListener');
		messageHandler.process({message: 'Hello World!'});
	});
	sp.createScope((scopedProvider: IServiceProvider) => {
		console.log('Enter Scope 2');
		const messageHandler = scopedProvider.resolve<MessageListener>('MessageListener');
		messageHandler.process({message: 'Hello World!'});
	});
	console.log(`Demo ${demoId} Completed`);
}
