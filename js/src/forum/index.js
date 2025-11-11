import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import UserPage from 'flarum/forum/components/UserPage';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import ChangeEmailModal from 'flarum/forum/components/ChangeEmailModal';
import ChangePasswordModal from 'flarum/forum/components/ChangePasswordModal';
import UserCard from 'flarum/forum/components/UserCard';
import AvatarEditor from 'flarum/common/components/AvatarEditor';

app.initializers.add('yourvendor/flarum-lock-profile', () => {
  // Check if user can edit profiles (only admins can)
  const canEditProfile = () => {
    return app.session.user && app.session.user.isAdmin();
  };

  // Hide edit button on user card
  extend(UserCard.prototype, 'infoItems', function(items) {
    if (!canEditProfile() && this.attrs.user && this.attrs.user.id() === app.session.user?.id()) {
      items.remove('edit');
    }
  });

  // Disable all profile editing fields in settings
  extend(SettingsPage.prototype, 'settingsItems', function(items) {
    if (!canEditProfile()) {
      // Disable account section
      if (items.has('account')) {
        const accountItem = items.get('account');
        
        // Override to disable inputs after render
        extend(SettingsPage.prototype, 'oncreate', function() {
          setTimeout(() => {
            this.disableProfileFields();
          }, 50);
        });
      }
    }
  });

  // Add method to disable profile fields
  SettingsPage.prototype.disableProfileFields = function() {
    if (canEditProfile()) return;

    // Disable username field
    const usernameInput = document.querySelector('input[name="username"]');
    if (usernameInput) {
      usernameInput.disabled = true;
      usernameInput.style.opacity = '0.6';
      usernameInput.style.cursor = 'not-allowed';
      usernameInput.title = 'Profile editing is locked';
    }

    // Disable email field
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.disabled = true;
      emailInput.style.opacity = '0.6';
      emailInput.style.cursor = 'not-allowed';
      emailInput.title = 'Profile editing is locked';
    }

    // Disable bio field
    const bioField = document.querySelector('textarea[name="bio"]');
    if (bioField) {
      bioField.disabled = true;
      bioField.style.opacity = '0.6';
      bioField.style.cursor = 'not-allowed';
      bioField.title = 'Profile editing is locked';
    }

    // Hide change email button
    document.querySelectorAll('.Button--changeEmail, button[onclick*="email"]').forEach(btn => {
      btn.style.display = 'none';
    });

    // Disable avatar editor
    const avatarEditors = document.querySelectorAll('.AvatarEditor');
    avatarEditors.forEach(editor => {
      editor.style.opacity = '0.6';
      editor.style.pointerEvents = 'none';
      editor.style.cursor = 'not-allowed';
      editor.title = 'Profile editing is locked';
    });

    // Disable all save buttons in settings
    const saveButtons = document.querySelectorAll('.SettingsPage .Button--primary[type="submit"]');
    saveButtons.forEach(btn => {
      if (btn.textContent.includes('Save')) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
      }
    });
  };

  // Block avatar editor completely for non-admins
  override(AvatarEditor.prototype, 'view', function(original) {
    if (!canEditProfile() && this.attrs.user && this.attrs.user.id() === app.session.user?.id()) {
      return m('.AvatarEditor', {
        style: 'opacity: 0.6; pointer-events: none; cursor: not-allowed;',
        title: 'Profile editing is locked'
      }, original());
    }
    return original();
  });

  // Prevent change email modal from opening
  override(ChangeEmailModal.prototype, 'oninit', function(original, vnode) {
    if (!canEditProfile()) {
      app.modal.close();
      app.alerts.show({ type: 'error' }, app.translator.trans('yourvendor-lock-profile.forum.profile_locked'));
      return;
    }
    return original(vnode);
  });

  // Intercept settings page form submission
  extend(SettingsPage.prototype, 'onsubmit', function(e) {
    if (!canEditProfile()) {
      e.preventDefault();
      app.alerts.show({ type: 'error' }, app.translator.trans('yourvendor-lock-profile.forum.profile_locked'));
    }
  });
});
