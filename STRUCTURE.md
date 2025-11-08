# Flarum Lock Profile - Project Structure

## Overview
This document explains the structure and purpose of each file in the extension.

## Directory Structure

```
flarum-lock-profile/
│
├── composer.json                 # PHP package configuration
├── package.json                  # npm package configuration
├── webpack.config.js             # JavaScript build configuration
├── extend.php                    # Main extension registration file
├── LICENSE                       # MIT License
├── README.md                     # Main documentation
├── INSTALLATION.md              # Installation guide
├── .gitignore                   # Git ignore rules
│
├── src/                         # PHP source code
│   └── Listener/
│       └── PreventProfileEdit.php  # Backend logic for blocking edits
│
├── js/                          # JavaScript source code
│   ├── tsconfig.json           # TypeScript configuration
│   ├── src/
│   │   ├── shims.d.ts          # TypeScript declarations
│   │   ├── admin/
│   │   │   └── index.js        # Admin panel integration
│   │   └── forum/
│   │       └── index.js        # Forum frontend logic
│   └── dist/                    # Compiled JavaScript (generated)
│       ├── admin.js
│       └── forum.js
│
├── less/                        # Stylesheets
│   └── forum.less              # Forum styling for locked elements
│
├── locale/                      # Translations
│   └── en.yml                  # English language file
│
├── vendor/                      # Composer dependencies (generated)
└── node_modules/                # npm dependencies (generated)
```

## Key Files Explained

### Backend (PHP)

#### `composer.json`
- Defines package metadata (name, description, version)
- Specifies dependencies (Flarum core version)
- Sets up PSR-4 autoloading for PHP classes
- Declares this as a Flarum extension

#### `extend.php`
- Main extension configuration file
- Registers frontend JavaScript and CSS
- Registers event listeners
- Registers locale files
- This is where Flarum looks to understand what your extension does

#### `src/Listener/PreventProfileEdit.php`
- Listens to the `User\Event\Saving` event
- Checks if a user is trying to edit their profile
- Blocks non-admin users from modifying locked fields
- Throws permission denied exception if edit is attempted
- **Locked fields**: username, email, bio, avatarUrl

### Frontend (JavaScript)

#### `js/src/forum/index.js`
- Extends Flarum's UserPage and SettingsPage components
- Disables input fields (username, email, bio)
- Hides edit buttons and avatar upload controls
- Provides visual feedback (opacity, cursor changes)
- Only affects non-admin users

#### `js/src/admin/index.js`
- Minimal admin panel integration
- Displays information about the extension
- Can be extended to add settings in the future

#### `webpack.config.js`
- Uses Flarum's webpack configuration
- Compiles JavaScript and prepares it for production

#### `package.json`
- Lists npm dependencies
- Defines build scripts:
  - `npm run dev`: Development mode with watch
  - `npm run build`: Production build

### Styling

#### `less/forum.less`
- Styles for disabled/locked form elements
- Hides avatar editor for non-admin users
- Adds visual indicators for locked fields

### Localization

#### `locale/en.yml`
- English translations for the extension
- Used for error messages and admin panel text
- Can be extended with other languages

## How It Works

### Flow Diagram

```
User attempts to edit profile
          ↓
Frontend JavaScript (forum/index.js)
- Disables input fields visually
- Hides edit buttons
          ↓
If user bypasses frontend (uses API directly)
          ↓
Backend Listener (PreventProfileEdit.php)
- Intercepts save event
- Checks user permissions
- Blocks if not admin
          ↓
Exception thrown or save allowed
```

### Security Layers

1. **Frontend Protection**: Prevents accidental edits, improves UX
2. **Backend Protection**: Actual security layer, prevents API bypasses
3. **Admin Exception**: Admins can always edit profiles

## Customization Points

### Adding More Locked Fields
Edit `src/Listener/PreventProfileEdit.php`:
```php
$lockedFields = ['username', 'email', 'bio', 'avatarUrl', 'newField'];
```

And update `js/src/forum/index.js` to disable the field in the UI.

### Adding Settings Panel
Extend `js/src/admin/index.js` to add toggleable settings:
```javascript
.registerSetting({
  setting: 'lockProfile.lockUsername',
  type: 'boolean',
  label: 'Lock Username'
})
```

### Adding Permissions
You can create custom permissions in `extend.php` to allow certain user groups to edit profiles.

## Dependencies

### PHP Dependencies (via Composer)
- `flarum/core`: ^1.2.0

### JavaScript Dependencies (via npm)
- `flarum-webpack-config`: Build system
- `webpack`: Module bundler
- `webpack-cli`: Command line interface

## Build Process

1. **Development**:
   ```bash
   npm run dev
   ```
   - Watches for file changes
   - Rebuilds automatically
   - Source maps included

2. **Production**:
   ```bash
   npm run build
   ```
   - Minifies code
   - Optimizes for production
   - No source maps

## Extension Lifecycle

1. **Installation**: Copy files, run `composer install`, `npm install`, `npm run build`
2. **Enabling**: Register with Flarum, load PHP classes and JavaScript
3. **Runtime**: 
   - Frontend JS modifies UI
   - Backend listener intercepts save events
4. **Disabling**: Unregister from Flarum
5. **Uninstallation**: Remove files

## Future Enhancements

Possible additions to this extension:

1. **Granular Control**: Settings to lock individual fields
2. **Group-Based Locking**: Lock only for specific user groups
3. **Time-Based Locking**: Lock after user account age
4. **Audit Log**: Log all profile edit attempts
5. **Custom Fields**: Support for custom profile fields from other extensions

## Contributing

When contributing:
1. Follow Flarum coding standards
2. Test both frontend and backend changes
3. Update documentation
4. Add translations for new strings
5. Test with different Flarum versions

## Testing Checklist

- [ ] Regular user cannot edit username
- [ ] Regular user cannot edit email
- [ ] Regular user cannot edit bio
- [ ] Regular user cannot upload avatar
- [ ] Admin can edit all fields
- [ ] API direct calls are blocked
- [ ] No console errors
- [ ] Styling looks correct
- [ ] Works on mobile devices
- [ ] Compatible with Flarum 1.2.0+
