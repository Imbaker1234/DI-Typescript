import {IMessageProcessor} from './message-processor.interface';
import {ILogger} from '../logging/logger.interface';

export interface IMessageRelay extends IMessageProcessor {}

export class MessageRelay implements IMessageProcessor {
	logger: ILogger;

	constructor(logger: ILogger) {
		this.logger = logger;
	}

	process(msg: object): void {
		this.logger.debug('Entering MessageRelay.process', { msg });
		console.log({ announcement: 'RELAYING MESSAGE', ...msg });
		this.logger.info('Exiting MessageRelay.process', { msg });
	}
}
