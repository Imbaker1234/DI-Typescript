/**
 * An Enum used to define the Lifetime of a Service.
 */
export enum Lifetime {
	Transient, // A new instance is created every time.
	Singleton, // A single instance is created and shared across all resolutions.
	Scoped // A single instance is created per scope.
}
