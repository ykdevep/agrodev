import 'angular2-meteor-polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './imports/app/app.module';
import {enableProdMode} from '@angular/core';

enableProdMode();

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);