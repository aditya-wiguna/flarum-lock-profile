# Flarum Lock Profile Extension

A Flarum extension that prevents users from editing their profile information, including username, email, bio, and profile picture.

## Features

- 🔒 **Blocks Profile Editing**: Prevents regular users from modifying their profile information
- 👤 **Locks Username**: Users cannot change their username
- 📧 **Locks Email**: Users cannot change their email address
- 📝 **Locks Bio**: Users cannot edit their bio/about section
- 🖼️ **Locks Avatar**: Users cannot upload or change their profile picture
- 👑 **Admin Exception**: Administrators can still edit any user profile
- 🎨 **UI Modifications**: Hides/disables edit buttons and form fields for regular users
- 🛡️ **Backend Protection**: Server-side validation prevents API bypasses

## Installation

### Manual Installation

1. Download this extension
2. Extract it to your Flarum `extensions` directory: `extensions/aditya-wiguna-flarum-lock-profile`
3. Install dependencies:
```bash
cd extensions/aditya-wiguna-flarum-lock-profile
composer install --no-dev
npm install
npm run build
```
4. Enable the extension in your Flarum admin panel

### Via Composer (if published)

```bash
composer require aditya-wiguna/flarum-lock-profile
```

## Usage

Once installed and enabled:

1. Go to your Flarum admin panel
2. Navigate to Extensions
3. Enable "Lock Profile"
4. Regular users will no longer be able to edit their profile information
5. Administrators retain full editing capabilities

## How It Works

This extension works on two levels:

### Frontend (JavaScript)
- Disables input fields in the settings page
- Hides edit buttons and avatar upload controls
- Provides visual feedback that fields are locked

### Backend (PHP)
- Listens to user save events
- Blocks any attempts to modify locked fields via API
- Returns permission denied errors for unauthorized edits
- Allows admin users to bypass restrictions

## Customization

### Modify Locked Fields

Edit `src/Listener/PreventProfileEdit.php` and modify the `$lockedFields` array:

```php
$lockedFields = ['username', 'email', 'bio', 'avatarUrl'];
```

### Change Vendor Name

Replace all instances of:
- `aditya-wiguna` with your vendor name
- `AdityaWiguna` with your capitalized vendor name
- Update `composer.json` and `package.json` accordingly

### Styling

Modify `less/forum.less` to customize the appearance of locked elements.

## Development

### Building Assets

```bash
# Development mode with watch
npm run dev

# Production build
npm run build
```

### File Structure

```
flarum-lock-profile/
├── composer.json          # PHP dependencies and autoloading
├── extend.php            # Extension configuration
├── js/
│   └── src/
│       ├── admin/        # Admin panel JavaScript
│       └── forum/        # Forum frontend JavaScript
├── less/
│   └── forum.less        # Forum styles
├── locale/
│   └── en.yml           # English translations
├── src/
│   └── Listener/
│       └── PreventProfileEdit.php  # Backend event listener
├── LICENSE
├── README.md
├── package.json          # npm dependencies
└── webpack.config.js     # Build configuration
```

## Compatibility

- **Flarum Version**: ^1.2.0 or higher
- **PHP Version**: ^7.3 or ^8.0

## Security

This extension provides both frontend UI restrictions and backend API validation to ensure users cannot bypass the restrictions using browser developer tools or direct API calls.

## Support

For issues, questions, or contributions, please visit:
- GitHub Issues (add your repository URL)
- Flarum Community Forum

## License

MIT License - see LICENSE file for details

## Credits

- Extension created for Flarum community
- Built with Flarum Extension API

## Changelog

### Version 1.0.0
- Initial release
- Lock username, email, bio, and avatar editing
- Admin bypass functionality
- Frontend and backend protection

## TODO / Future Enhancements

- [ ] Add admin panel settings to selectively enable/disable specific fields
- [ ] Add permission-based locking (lock for specific groups)
- [ ] Add option to lock fields only after certain conditions (e.g., after X days)
- [ ] Add logging for edit attempts
- [ ] Support for custom profile fields from other extensions
