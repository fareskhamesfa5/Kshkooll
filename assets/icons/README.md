# Kshkooll SVG Icon Library

All interface icons are maintained as reusable SVG symbols in `assets/icons/icons.svg`.
The sprite uses a consistent 24×24 viewBox, rounded strokes, and `currentColor` so it adapts to light and dark themes.

## Available symbols

- `icon-home`
- `icon-book`
- `icon-languages`
- `icon-landmark`
- `icon-code`
- `icon-exam`
- `icon-progress`
- `icon-user`
- `icon-settings`
- `icon-search`
- `icon-plus`
- `icon-edit`
- `icon-trash`
- `icon-save`
- `icon-download`
- `icon-upload`
- `icon-arrow`
- `icon-close`
- `icon-info`
- `icon-check`
- `icon-warning`
- `icon-mail`
- `icon-lock`
- `icon-eye`
- `icon-eyeoff`
- `icon-adduser`
- `icon-login`
- `icon-logout`
- `icon-bell`
- `icon-help`
- `icon-calendar`
- `icon-trophy`
- `icon-chart`
- `icon-shield`
- `icon-external`
- `icon-chevron`
- `icon-menu`
- `icon-sun`
- `icon-moon`

## Use in HTML

```html
<svg class="ui-icon" role="img" aria-label="Home">
  <use href="../assets/icons/icons.svg#icon-home"></use>
</svg>
```

Use the relative sprite path appropriate to the current page depth. The shared navigation initializes its icons from `js/theme.js`; animation and reduced-motion behavior are in `css/global.css` and `auth/auth.css`.
