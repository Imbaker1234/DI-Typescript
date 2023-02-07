"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const demos = require('../dist/demos/container.demo');

describe('Demonstrations', () => {

	it('Should run all of the demos', () => {
		demos.demonstrations.forEach(demo => {
			demo.execute();
		})
	});
});
