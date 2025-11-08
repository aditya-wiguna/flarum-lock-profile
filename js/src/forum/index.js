import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserPage from 'flarum/forum/components/UserPage';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import ChangeEmailModal from 'flarum/forum/components/ChangeEmailModal';
import ChangePasswordModal from 'flarum/forum/components/ChangePasswordModal';

app.initializers.add('yourvendor/flarum-lock-profile', () => {
  // Disable the edit profile button
  extend(UserPage.prototype, 'oncreate', function() {
    if (app.session.user && !app.session.user.isAdmin()) {
      // Hide edit profile controls for non-admin users
      const editButtons = document.querySelectorAll('.UserCard-controls');
      editButtons.forEach(button => {
        if (button.textContent.includes('Edit')) {
          button.style.display = 'none';
        }
      });
    }
  });

  // Disable settings page inputs
  extend(SettingsPage.prototype, 'oncreate', function() {
    if (app.session.user && !app.session.user.isAdmin()) {
      setTimeout(() => {
        // Disable username field
        const usernameInput = document.querySelector('input[name="username"]');
        if (usernameInput) {
          usernameInput.disabled = true;
          usernameInput.style.opacity = '0.5';
          usernameInput.style.cursor = 'not-allowed';
        }

        // Disable email field
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
          emailInput.disabled = true;
          emailInput.style.opacity = '0.5';
          emailInput.style.cursor = 'not-allowed';
        }

        // Disable bio field
        const bioField = document.querySelector('textarea[name="bio"]');
        if (bioField) {
          bioField.disabled = true;
          bioField.style.opacity = '0.5';
          bioField.style.cursor = 'not-allowed';
        }

        // Hide change email button
        const changeEmailBtn = document.querySelector('.Button--changeEmail');
        if (changeEmailBtn) {
          changeEmailBtn.style.display = 'none';
        }

        // Hide avatar upload
        const avatarUpload = document.querySelector('.User-avatar');
        const avatarControls = document.querySelector('.AvatarEditor');
        if (avatarUpload) {
          const parent = avatarUpload.closest('.Form-group');
          if (parent) {
            parent.style.opacity = '0.5';
            parent.style.pointerEvents = 'none';
          }
        }
        if (avatarControls) {
          avatarControls.style.display = 'none';
        }
      }, 100);
    }
  });

  // Prevent change email modal
  extend(ChangeEmailModal.prototype, 'oninit', function() {
    if (app.session.user && !app.session.user.isAdmin()) {
      app.modal.close();
      app.alerts.show({ type: 'error' }, 'You are not allowed to change your email.');
    }
  });
});
