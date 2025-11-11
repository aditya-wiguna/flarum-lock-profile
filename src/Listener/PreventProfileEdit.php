<?php

namespace AdityaWiguna\LockProfile\Listener;

use Flarum\User\Event\Saving;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Support\Arr;

class PreventProfileEdit
{
    /**
     * Prevent ALL users (including admins) from editing username and email
     *
     * @param Saving $event
     * @throws PermissionDeniedException
     */
    public function handle(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;

        // Get the attributes being changed
        $attributes = Arr::get($data, 'attributes', []);

        // List of LOCKED fields for EVERYONE (including admins)
        $lockedFields = ['username', 'email'];

        // Check if any locked field is being modified
        foreach ($lockedFields as $field) {
            if (array_key_exists($field, $attributes)) {
                // Field is being changed - BLOCK IT
                $this->throwLockedException($field);
            }
        }

        // Additional check: if the user model has dirty attributes for locked fields
        foreach ($lockedFields as $field) {
            if ($user->isDirty($field)) {
                $this->throwLockedException($field);
            }
        }
    }

    /**
     * Throw a permission denied exception
     *
     * @param string $field
     * @throws PermissionDeniedException
     */
    private function throwLockedException(string $field = 'field')
    {
        throw new PermissionDeniedException(
            ucfirst($field) . ' cannot be changed. This field is locked by the administrator.'
        );
    }
}
