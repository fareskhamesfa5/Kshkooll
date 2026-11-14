# Kshkooll Google Material Symbols Rounded

The interface icon sprite is built from the official Google Material Symbols Rounded SVG assets and stored locally in `assets/icons/icons.svg`.

- Source: https://github.com/google/material-design-icons
- Google Fonts icon library: https://fonts.google.com/icons
- Style: Material Symbols Rounded
- SVG viewBox: `0 -960 960 960`
- License: Apache License 2.0

The Google SVG path data is preserved in the local sprite and uses `currentColor` so icons adapt to light and dark themes.

## Available symbols

`home`, `book`, `languages`, `landmark`, `code`, `exam`, `progress`, `user`, `settings`, `search`, `plus`, `edit`, `trash`, `save`, `download`, `upload`, `arrow`, `close`, `info`, `check`, `warning`, `mail`, `lock`, `eye`, `eyeoff`, `adduser`, `login`, `logout`, `bell`, `help`, `calendar`, `trophy`, `chart`, `shield`, `external`, `chevron`, `menu`, `sun`, `moon`.

## Use in HTML

```html
<svg class="ui-icon" aria-hidden="true">
  <use href="../assets/icons/icons.svg#icon-home"></use>
</svg>
```

Use the relative sprite path appropriate to the current page depth. Shared navigation and theme controls load the local sprite through `js/theme.js`. Motion and reduced-motion behavior are defined in `css/global.css` and `auth/auth.css`.

Google Material Symbols are distributed under the Apache License 2.0. See the upstream repository for the complete license text.
