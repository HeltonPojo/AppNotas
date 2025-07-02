FROM php:8.1-apache

RUN apt-get update && apt-get install -y \
  libicu-dev \
  && docker-php-ext-install intl pdo pdo_mysql mysqli

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html
