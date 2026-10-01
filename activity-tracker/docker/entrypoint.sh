#!/bin/sh
set -e

php artisan migrate --force
php artisan db:seed --force

php artisan config:cache
php artisan route:cache

exec apache2-foreground
