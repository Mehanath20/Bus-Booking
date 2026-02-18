import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

console.log('App bootstrapping started...');

bootstrapApplication(App, appConfig)
  .then(() => console.log('App bootstrapping complete!'))
  .catch((err) => {
    console.error('App bootstrapping failed:', err);
    document.body.innerHTML += '<h1 style="color: red; background: white;">BOOTSTRAP FAILED: ' + err + '</h1>';
  });
