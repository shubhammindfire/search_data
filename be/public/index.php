<?php

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

Request::enableHttpMethodParameterOverride(); // for ?_method=PATCH while editPropertyRecord use METHOD as POST and add ?_method=PATCH to specify that actually method used is PATCH
return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
