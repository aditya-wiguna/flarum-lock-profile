<?php

namespace YourVendor\LockProfile\Listener;

use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;

class PreventProfileEdit
{
    /**
     * @param Saving $event
     */
    public function handle(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;

        // Allow admins to edit profiles
        if ($actor->isAdmin()) {
            return;
        }

        // Check if user is trying to edit their own profile
        if ($user->id === $actor->id) {
            // Get the attributes being changed
            $attributes = Arr::get($data, 'attributes', []);

            // List of locked fields
            $lockedFields = ['username', 'email', 'bio', 'avatarUrl'];

            // Check if any locked field is being modified
            foreach ($lockedFields as $field) {
                if (isset($attributes[$field])) {
                    throw new \Flarum\User\Exception\PermissionDeniedException(
                        'You are not allowed to edit your profile information.'
                    );
                }
            }
        }
    }
}
