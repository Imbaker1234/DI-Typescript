import {LogLevel} from './loglevel.enum';

export interface ILogger {
	debug(message: string, context?: unknown): void;
	info(message: string, context?: unknown): void;
	warn(message: string, context?: unknown): void;
	error(message: string, context?: unknown): void;
	log(message: string, logLevel: LogLevel, context?: unknown): void;
}
