<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private channel per mesin — hanya user authenticated
Broadcast::channel('machine.{id}', function ($user, $id) {
    return auth()->check();
});
