import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-menu',
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.scss']
})
export class LanguageMenuComponent {

  language: string = this.translateService.getDefaultLang();
  
  constructor(
    private translateService: TranslateService
  ) {}

  setLanguage(language:string) {
    this.translateService.use(language);
    this.language = language;
  }
}
