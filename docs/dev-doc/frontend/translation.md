# Translation

## How it works

We have defined json files for each language in the `/front/src/assets/i18n` folder. Each file contains the translations for the language. The file name is the language code (e.g. `en.json` for English).
Here is an example of a translation file:

```json
{
  "ACTION": {
    "YES": "Yes",
    "NO": "No",

    "SAVE": "Save",
    "CANCEL": "Cancel",
  }
}
```

To use a translation, you can use the `translate` pipe in the html file:

```html
<p>{{ 'ACTION.YES' | translate }}</p>
```

You can also use the `translate` service in the typescript file:

```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translate: TranslateService) {}

this.translate.instant('ACTION.YES'); // returns 'Yes'
```

## Adding a new language

To add a new language, you need to create a new json file in the `/front/src/assets/i18n` folder. The file name must be the language code (e.g. `en.json` for English).
You also need to add a png flag in the `/front/src/assets` folder. The file name must be the language code (e.g. `en.png` for English).

Then, you need to add the language option in the language menu component:

```html title="/front/src/app/components/language-menu/language-menu.component.ts"
<mat-menu #menu="matMenu" class="mat-menu">
    <button mat-menu-item (click)="setLanguage('fr')" class="language-button-item">
        <img src="assets/fr.png" class="menu-img" alt="fr"/>
        <span class="language-span">Français</span>
    </button>
    <button mat-menu-item (click)="setLanguage('en')" class="language-button-item">
        <img src="assets/en.png" class="menu-img" alt="en"/>
        <span class="language-span">English</span>
    </button>
    ...
</mat-menu>
```