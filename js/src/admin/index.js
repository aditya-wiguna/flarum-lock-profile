import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import EditUserModal from 'flarum/admin/components/EditUserModal';

app.initializers.add('yourvendor/flarum-lock-profile', () => {
  app.extensionData
    .for('yourvendor-flarum-lock-profile')
    .registerSetting({
      setting: 'yourvendor-flarum-lock-profile.info',
      type: 'info',
      label: app.translator.trans('yourvendor-lock-profile.admin.info_label'),
    });

  // Disable username and email fields in admin Edit User modal for ALL users
  extend(EditUserModal.prototype, 'oncreate', function() {
    setTimeout(() => {
      // Disable username field
      const usernameInput = document.querySelector('.EditUserModal input[name="username"]');
      if (usernameInput) {
        usernameInput.disabled = true;
        usernameInput.style.opacity = '0.6';
        usernameInput.style.cursor = 'not-allowed';
        usernameInput.title = 'Username cannot be changed';
        usernameInput.style.backgroundColor = '#f5f5f5';
      }

      // Disable email field - find it by type or common selectors
      const emailInput = document.querySelector('.EditUserModal input[type="email"]') 
        || document.querySelector('.EditUserModal input[name="email"]');
      if (emailInput) {
        emailInput.disabled = true;
        emailInput.style.opacity = '0.6';
        emailInput.style.cursor = 'not-allowed';
        emailInput.title = 'Email cannot be changed';
        emailInput.style.backgroundColor = '#f5f5f5';
      }
    }, 100);
  });

  // Prevent form submission if username or email changed
  extend(EditUserModal.prototype, 'onsubmit', function(e) {
    const user = this.attrs.user;
    const data = this.data();
    
    // Check if username is being changed
    if (data.username && data.username !== user.username()) {
      e.preventDefault();
      app.alerts.show({ type: 'error' }, 'Username cannot be changed.');
      return false;
    }
    
    // Check if email is being changed
    if (data.email && data.email !== user.email()) {
      e.preventDefault();
      app.alerts.show({ type: 'error' }, 'Email cannot be changed.');
      return false;
    }
  });
});
