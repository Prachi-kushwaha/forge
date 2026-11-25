Forge WEBSITE — V2
Open index.html in a browser to run locally (or use VS Code Live Server).

This version is data-driven:
- tutorials/series content is stored in assets/content.js
- generic reader UI is assets/reader.js
- series key is passed in URL, e.g. reader.html?series=sft or ?series=rl
- add lessons as objects with title, minutes, content (HTML string)
- sidebar automatically updates to the number/order of lessons
- lesson search, completion state (localStorage), previous/next, copy link, TOC, dark mode and mobile sidebar are implemented.

To add a lesson, append an object inside the relevant series `lessons` array in assets/content.js.
To create another series, add a new object to window.SERIES and link to reader.html?series=yourkey.
