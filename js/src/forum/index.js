import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import UserPage from 'flarum/forum/components/UserPage';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import ChangeEmailModal from 'flarum/forum/components/ChangeEmailModal';
import ChangePasswordModal from 'flarum/forum/components/ChangePasswordModal';
import UserCard from 'flarum/forum/components/UserCard';
import AvatarEditor from 'flarum/common/components/AvatarEditor';

app.initializers.add('aditya-wiguna/flarum-lock-profile', () => {
  // LOCK FOR ALL USERS INCLUDING ADMINS
  const canEditProfile = () => {
    return false; // Always return false - nobody can edit username/email
  };

  // Hide edit button on user card
  extend(UserCard.prototype, 'infoItems', function(items) {
    if (this.attrs.user && this.attrs.user.id() === app.session.user?.id()) {
      items.remove('edit');
    }
    
    // Remove the controls dropdown entirely for all users
    if (items.has('controls')) {
      items.remove('controls');
    }
  });

  // Hide controls dropdown button via DOM manipulation as additional protection
  extend(UserCard.prototype, 'oncreate', function() {
    setTimeout(() => {
      // Hide the dropdown toggle button with ellipsis icon
      const controlsButtons = document.querySelectorAll('.Dropdown-toggle[aria-label*="controls"], .Dropdown-toggle[data-toggle="dropdown"]');
      controlsButtons.forEach(btn => {
        if (btn.textContent.includes('Controls') || btn.querySelector('.fa-ellipsis-v')) {
          btn.style.display = 'none';
        }
      });
    }, 50);
  });

  // Disable all profile editing fields in settings
  extend(SettingsPage.prototype, 'settingsItems', function(items) {
    // Disable account section for everyone
    if (items.has('account')) {
      const accountItem = items.get('account');
      
      // Override to disable inputs after render
      extend(SettingsPage.prototype, 'oncreate', function() {
        setTimeout(() => {
          this.disableProfileFields();
        }, 50);
      });
    }
  });

  // Add method to disable profile fields
  SettingsPage.prototype.disableProfileFields = function() {
    // Disable username field for EVERYONE
    const usernameInput = document.querySelector('input[name="username"]');
    if (usernameInput) {
      usernameInput.disabled = true;
      usernameInput.style.opacity = '0.6';
      usernameInput.style.cursor = 'not-allowed';
      usernameInput.title = 'Username editing is locked by administrator';
    }

    // Disable email field for EVERYONE
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.disabled = true;
      emailInput.style.opacity = '0.6';
      emailInput.style.cursor = 'not-allowed';
      emailInput.title = 'Email editing is locked by administrator';
    }

    // Disable bio field
    const bioField = document.querySelector('textarea[name="bio"]');
    if (bioField) {
      bioField.disabled = true;
      bioField.style.opacity = '0.6';
      bioField.style.cursor = 'not-allowed';
      bioField.title = 'Profile editing is locked';
    }

    // Hide the entire Account fieldset (contains Change Password and Change Email buttons)
    const accountFieldset = document.querySelector('.Settings-account');
    if (accountFieldset) {
      accountFieldset.style.display = 'none';
    }

    // Also hide individual change email/password buttons as fallback
    document.querySelectorAll('.Button--changeEmail, .item-changeEmail, .item-changePassword, button[onclick*="email"]').forEach(btn => {
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

  // Block avatar editor completely
  override(AvatarEditor.prototype, 'view', function(original) {
    return m('.AvatarEditor', {
      style: 'opacity: 0.6; pointer-events: none; cursor: not-allowed;',
      title: 'Profile editing is locked'
    }, original());
  });

  // Prevent change email modal from opening
  override(ChangeEmailModal.prototype, 'oninit', function(original, vnode) {
    app.modal.close();
    app.alerts.show({ type: 'error' }, app.translator.trans('aditya-wiguna-lock-profile.forum.profile_locked'));
    return;
  });

  // Intercept settings page form submission
  extend(SettingsPage.prototype, 'onsubmit', function(e) {
    e.preventDefault();
    app.alerts.show({ type: 'error' }, 'Username and email cannot be changed.');
  });
});
