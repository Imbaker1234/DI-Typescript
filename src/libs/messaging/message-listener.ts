import {IMessageProcessor} from './message-processor.interface';
import {ILogger} from '../logging/logger.interface';

export class MessageListener implements IMessageProcessor {
	service: IMessageProcessor;
	logger: ILogger;

	constructor(service: IMessageProcessor, logger: ILogger) {
		this.service = service;
		this.logger = logger;
	}

	process(msg: any): void {
		this.logger.debug('Entering MessageListener.process', { msg });
		this.service.process(msg);
	}
}
