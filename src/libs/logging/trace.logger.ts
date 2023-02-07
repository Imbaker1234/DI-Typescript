import {ConsoleLogger} from './console.logger';
import {LogLevel} from './loglevel.enum';

export class TraceLogger extends ConsoleLogger {
	private readonly x_b3_trace_id: string;

	constructor(x_b3_trace_id: string) {
		super();
		this.x_b3_trace_id = x_b3_trace_id;
	}

	log(message: string, logLevel: LogLevel,  context?: any) {
		context = context || {};
		context.x_b3_trace_id = this.x_b3_trace_id;
		super.log(message, logLevel, context);
	}
}
