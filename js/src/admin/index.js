import app from 'flarum/admin/app';

app.initializers.add('yourvendor/flarum-lock-profile', () => {
  app.extensionData
    .for('yourvendor-flarum-lock-profile')
    .registerSetting({
      setting: 'yourvendor-flarum-lock-profile.info',
      type: 'info',
      label: app.translator.trans('yourvendor-lock-profile.admin.info_label'),
    });
});
