# Installation Guide - Flarum Lock Profile Extension

## Prerequisites

- Flarum 1.2.0 or higher installed
- SSH access to your server
- Composer installed
- Node.js and npm installed

## Step-by-Step Installation

### Method 1: Manual Installation (Recommended for Development)

1. **Navigate to your Flarum extensions directory:**
```bash
cd /path/to/your/flarum/extensions
```

2. **Create the extension directory:**
```bash
mkdir -p yourvendor-flarum-lock-profile
```

3. **Copy all extension files to this directory**

4. **Install PHP dependencies:**
```bash
cd yourvendor-flarum-lock-profile
composer install --no-dev
```

5. **Install JavaScript dependencies and build assets:**
```bash
npm install
npm run build
```

6. **Enable the extension:**
   - Go to your Flarum admin panel
   - Navigate to Extensions
   - Find "Lock Profile" and click Enable

### Method 2: Via Composer (If Published to Packagist)

1. **Add to your Flarum installation:**
```bash
cd /path/to/your/flarum
composer require yourvendor/flarum-lock-profile
```

2. **Enable via admin panel or CLI:**
```bash
php flarum cache:clear
php flarum extension:enable yourvendor-flarum-lock-profile
```

## Customization Before Installation

### Change Vendor Name

Before installing, you should customize the vendor name:

1. **Update composer.json:**
   - Change `yourvendor/flarum-lock-profile` to `your-vendor/flarum-lock-profile`
   - Update the namespace in autoload section

2. **Update namespace in all PHP files:**
   - Replace `YourVendor\LockProfile` with `YourActualVendor\LockProfile`

3. **Update package.json:**
   - Change `@yourvendor/flarum-lock-profile` to `@your-vendor/flarum-lock-profile`

4. **Update locale file:**
   - Rename the key from `yourvendor-lock-profile` to `your-vendor-lock-profile`

5. **Update extend.php if needed**

## Verification

After installation, verify the extension is working:

1. **As a regular user:**
   - Try to access your profile settings
   - Confirm that username, email, and bio fields are disabled
   - Confirm that avatar upload is hidden

2. **As an admin:**
   - Confirm you can still edit any user profile
   - Test editing another user's profile

3. **Check for errors:**
```bash
tail -f /path/to/flarum/storage/logs/flarum.log
```

## Troubleshooting

### Extension Not Showing in Admin Panel

1. Clear cache:
```bash
php flarum cache:clear
```

2. Check if composer autoload is working:
```bash
composer dump-autoload
```

### JavaScript Not Loading

1. Rebuild assets:
```bash
cd extensions/yourvendor-flarum-lock-profile
npm run build
```

2. Clear browser cache and Flarum cache:
```bash
php flarum cache:clear
```

### Profile Fields Still Editable

1. Ensure the extension is enabled in admin panel
2. Check browser console for JavaScript errors
3. Try logging out and back in
4. Clear all caches

### Permission Errors

Ensure the extension files have correct permissions:
```bash
chmod -R 755 extensions/yourvendor-flarum-lock-profile
chown -R www-data:www-data extensions/yourvendor-flarum-lock-profile
```

## Uninstallation

1. **Disable the extension:**
   - Via admin panel: Extensions > Lock Profile > Disable
   - Or via CLI: `php flarum extension:disable yourvendor-flarum-lock-profile`

2. **Remove via Composer (if installed via Composer):**
```bash
composer remove yourvendor/flarum-lock-profile
```

3. **Or manually delete:**
```bash
rm -rf extensions/yourvendor-flarum-lock-profile
```

4. **Clear cache:**
```bash
php flarum cache:clear
```

## Development Mode

For development with auto-rebuild:

```bash
cd extensions/yourvendor-flarum-lock-profile
npm run dev
```

This will watch for file changes and rebuild automatically.

## Support

If you encounter issues:

1. Check Flarum logs: `storage/logs/flarum.log`
2. Check browser console for JavaScript errors
3. Verify all dependencies are installed
4. Ensure Flarum version compatibility (^1.2.0)

For further assistance, refer to the README.md or seek help in the Flarum community.
