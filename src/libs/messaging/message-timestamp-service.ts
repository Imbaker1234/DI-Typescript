import {IMessageProcessor} from './message-processor.interface';
import {ILogger} from '../logging/logger.interface';

export interface IMessageTimestampService extends IMessageProcessor {
	generateTimestamp(): number;
}

export class MessageTimestampService implements IMessageProcessor {
	service: IMessageProcessor;
	logger: ILogger;

	constructor(service: IMessageProcessor, logger: ILogger) {
		this.service = service;
		this.logger = logger;
	}

	generateTimestamp(): number {
		return new Date().getTime();
	}

	process(msg: any): void {
		this.logger.debug('Entering MessageTimestampService.process', { msg });
		msg.timestamp = this.generateTimestamp();
		this.service.process(msg);
	}
}
