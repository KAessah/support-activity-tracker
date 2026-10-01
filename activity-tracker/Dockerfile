FROM php:8.4-apache

# PHP extensions: Postgres (production), SQLite (tests), zip, opcache.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libsqlite3-dev libzip-dev unzip git \
    && docker-php-ext-install pdo_pgsql pdo_sqlite zip opcache \
    && apt-get purge -y --auto-remove \
    && rm -rf /var/lib/apt/lists/* \
    && a2enmod rewrite headers

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory
COPY . .

# Production images exclude development dependencies by default. CI overrides
# these options so the exact image it builds can execute PHPUnit.
ARG COMPOSER_INSTALL_OPTIONS="--no-dev --optimize-autoloader"
RUN composer install --no-interaction --no-progress --prefer-dist ${COMPOSER_INSTALL_OPTIONS}

# Apache vhost (DocumentRoot is /var/www/html/public)
COPY ./apache/000-default.conf /etc/apache2/sites-enabled/000-default.conf

RUN mkdir -p storage/logs bootstrap/cache \
    && chown -R root:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["entrypoint.sh"]
