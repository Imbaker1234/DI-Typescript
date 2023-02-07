import {LogLevel} from './loglevel.enum';
import {ILogger} from './logger.interface';

export class ConsoleLogger implements ILogger {
	log(message: string, logLevel: LogLevel, context?: unknown): void {
		// @ts-ignore
		const key: string = logLevel.toString().toLowerCase();
		(console as any)[key](message, context);
	}

	debug(message: string, context?: unknown) {
		this.log(message, LogLevel.Debug, context);
	}

	info(message: string, context?: unknown) {
		this.log(message, LogLevel.Info, context);
	}

	warn(message: string, context?: unknown) {
		this.log(message, LogLevel.Warn, context);
	}

	error(message: string, context?: unknown) {
		this.log(message, LogLevel.Error, context);
	}
}
