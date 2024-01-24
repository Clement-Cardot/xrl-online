import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    private translateService: TranslateService,
  ) {
    const lang = localStorage.getItem('lang');
    this.translateService.setDefaultLang(lang || 'en');
    this.translateService.use(lang || 'en');
  }
  title = 'xrl';
}
