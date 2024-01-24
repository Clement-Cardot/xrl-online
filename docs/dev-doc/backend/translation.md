# Translation

When Generating a report (PDF or PPTX), the report is generated in the language of the user's website. 

To add a new language in the frontend, go check the [frontend translation documentation](../frontend/translation.md).

To add a new language in the backend, you will need to add a new json file in the `/back/src/main/resources/i18n` folder. The file name must be the language code (e.g. `en.json` for English).</br>
The backend will automatically detect the new language and use it.

Note : If the front-end language is not supported by the backend, the report will be generated in English by default.