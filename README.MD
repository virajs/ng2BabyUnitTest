# Angular 2 Baby Unit Tests

Baby steps to unit testing an Angular 2 application.

1. Must install pre-requisites

	```bash
	npm install -g tsd typescript live-server
	```

1. Create empty `package.json`

	```bash
	npm init -y
	```

1. Install npm packages

	```bash
	npm install --save angular2 systemjs traceur
	```

  **For the short term, remove the last line of *../node_modules/angular2/bundles/angular2.dev.js***
1. Make a source folder

	```bash
	mkdir -p src/app
	```

1. Install typings files

	```bash
	tsd install angular2 -rosa --config src/tsd.json
	```

1. Create a `tsconfig.json` file, in an editor

	```json
	{
		"compilerOptions": {
			"target": "ES5",
			"module": "commonjs",
			"sourceMap": true,
			"emitDecoratorMetadata": true,
			"experimentalDecorators": true,
			"removeComments": false,
			"noImplicitAny": true
		}
	}
	```

1. Create `app.ts` and enter

	```javascript
	import {bootstrap, Component, View} from 'angular2/angular2';

	@Component({
		selector: 'app'
	})
	@View({
		template: '<h1>My First Angular 2 App</h1>'
	})
	export class AppComponent { }

	bootstrap(AppComponent);
	```

1. Run the TypeScript compiler and watch for changes `npm run tsc`

1. Open 2nd terminal and launch the app in the browser `npm start`

1. For tests either browse to `src/unit-tests.html` or (if starting from scratch)
    `npm test`