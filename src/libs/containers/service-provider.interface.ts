export interface IServiceProvider {
	createScope(sp: (container: IServiceProvider) => void): void;
	resolve<T>(key: string): T;
}
