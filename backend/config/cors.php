<?php

return [
    // Hangi path'lere CORS uygulanacak
    'paths' => ['api/*'],

    // Hangi HTTP metodlarına izin var
    'allowed_methods' => ['*'],

    // Hangi origin'lerden istek kabul ediyoruz
    // Geliştirme ortamında frontend adresi
    'allowed_origins' => ['http://localhost:3000'],

    'allowed_origins_patterns' => [],

    // Hangi header'lara izin var
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Cookie göndermiyoruz (token tabanlı), false kalabilir
    'supports_credentials' => false,
];