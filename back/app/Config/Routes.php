<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// $routes->get('/', 'Home::index');


$routes->group('api', function ($routes) {
    $routes->post('login', 'Auth::login');
    $routes->post('register', 'Auth::register');
});

$routes->group('api', ['filter' => 'auth'], function ($routes) {
    $routes->get('pastas', 'Pastas::index');
    $routes->post('pastas', 'Pastas::create');
    $routes->put('pastas/(:num)', 'Pastas::update/$1');
    $routes->delete('pastas/(:num)', 'Pastas::delete/$1');

    $routes->get('notas', 'Notas::index');
    $routes->get('notas/(:num)', 'Notas::show/$1');
    $routes->post('notas', 'Notas::create');
    $routes->put('notas/(:num)', 'Notas::update/$1');
    $routes->delete('notas/(:num)', 'Notas::delete/$1');
});
