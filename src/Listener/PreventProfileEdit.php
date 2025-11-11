<?php

namespace YourVendor\LockProfile\Listener;

use Flarum\User\Event\Saving;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Support\Arr;

class PreventProfileEdit
{
    /**
     * Prevent non-admin users from editing their profiles
     *
     * @param Saving $event
     * @throws PermissionDeniedException
     */
    public function handle(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;

        // Allow admins to edit any profile
        if ($actor->isAdmin()) {
            return;
        }

        // Allow other users to edit someone else's profile if they have permission
        // (covered by Flarum's default permission system)
        if ($user->id !== $actor->id) {
            return;
        }

        // At this point, a non-admin user is trying to edit their own profile
        // Get the attributes being changed
        $attributes = Arr::get($data, 'attributes', []);
        
        // Also check relationships (like avatar upload)
        $relationships = Arr::get($data, 'relationships', []);

        // List of locked fields
        $lockedFields = [
            'username',
            'email',
            'bio',
            'avatarUrl',
            'password', // Also lock password changes if desired
        ];

        // Check if any locked field is being modified
        foreach ($lockedFields as $field) {
            if (array_key_exists($field, $attributes)) {
                // Field is being changed
                $this->throwLockedException();
            }
        }

        // Check if avatar is being uploaded/changed
        if (isset($relationships['avatar'])) {
            $this->throwLockedException();
        }

        // Additional check: if the user model has dirty attributes for locked fields
        foreach ($lockedFields as $field) {
            if ($user->isDirty($field)) {
                $this->throwLockedException();
            }
        }
    }

    /**
     * Throw a permission denied exception
     *
     * @throws PermissionDeniedException
     */
    private function throwLockedException()
    {
        throw new PermissionDeniedException(
            'Your profile is locked and cannot be edited. Please contact an administrator if you need to make changes.'
        );
    }
}
