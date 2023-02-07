import {IMessageProcessor} from './message-processor.interface';
import {ILogger} from '../logging/logger.interface';

export class MessageIsoService implements IMessageProcessor {
	service: IMessageProcessor;
	logger: ILogger;

	constructor(service: IMessageProcessor, logger: ILogger) {
		this.service = service;
		this.logger = logger;
	}

	generateTimestamp(): string {
		return new Date().toISOString();
	}

	process(msg: any): void {
		this.logger.debug('Entering MessageIsoService.process', { msg });
		msg.iso = this.generateTimestamp();
		this.service.process(msg);
	}
}
