import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Ensure global is defined before any library code runs.
(window as any).global = (window as any).global || window;

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

