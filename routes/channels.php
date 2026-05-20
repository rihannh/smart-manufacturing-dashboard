<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('machine.{id}', function ($user, $id) {
    return true; // semua user yang authenticated bisa subscribe
});
