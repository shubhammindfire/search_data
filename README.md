# search_data

An application demonstrating the searching and filtering of large amounts of data in a project.

## Technologies used

-   FrontEnd
    -   ReactJS
    -   Redux
    -   Bootstrap
    -   React Router DOM
    -   Axios
-   Backend
    -   Symfony5
    -   MySQL

## Installation and development guide

If you wish to run this app locally please follow the below steps:

-   Please make sure you have these installed on your machine:
    -   Node v14.17.2
    -   NPM v6.14.3
    -   PHP > v7.4.3 (I have tested it on PHP v8.0.10)
    -   Composer v2.0.12
    -   MySQL v8.0.25
-   Clone this repo
-   Move to `fe/` and run `npm install`
-   Move to `be/` and run `composer install`
-   Generate public and private key files for lexik_jwt package and place them at `be/config/jwt/` Please use execute the below commands to generate the public and private keys
    -   `openssl genrsa -out config/jwt/private.pem -aes256 4096`
    -   `openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem`
-   Add a `.env` at `be/` as,

```
###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=APP_SECRET_GENERATED_BY_SYMFONY
###< symfony/framework-bundle ###

###> doctrine/doctrine-bundle ###
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
#
DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@127.0.0.1:3306/YOUR_DATABASE_NAME?serverVersion=5.7"
###< doctrine/doctrine-bundle ###

###> nelmio/cors-bundle ###
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
###< nelmio/cors-bundle ###

###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=JWT_PASSPHRASE_GENERATED_BY_JWT
###< lexik/jwt-authentication-bundle ###
```

-   State the URL on which you run the react app and symfony app in the `/fe/src/constants.js` as shown below

    -   export const BASE_SERVER_URL = "URL_FOR_YOUR_SYMFONY_APP";
    -   export const BASE_REACT_ROUTE = "URL_FOR_YOUR_REACT_APP";

-   For running the react app run `npm start` in `fe/`
-   For running the symfony app, you can run a local php server with `php -S localhost:8000` or use the symfony cli command `symfony serve` in the `be/` directory (please note that to for this you must install the symfony cli on your machine)

### Git commit practices followed for this project

-   Init - Initial setup of a project
-   Feature - a new feature
-   Bug Fix - a bug fix
-   Docs - changes in documentation
-   Style - everything related to styling
-   Refactor - code changes that neither fixes a bug or adds a feature
-   Testing - code changes related to testing
