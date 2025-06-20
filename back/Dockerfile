FROM php:8.1-apache

# Habilita extensões PHP necessárias
RUN apt-get update && apt-get install -y \
  libicu-dev \
  && docker-php-ext-install intl pdo pdo_mysql mysqli

# Ativa o mod_rewrite do Apache
RUN a2enmod rewrite

# Altera o DocumentRoot para a pasta 'public'
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Atualiza o VirtualHost para usar o novo DocumentRoot
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

# Define o diretório de trabalho
WORKDIR /var/www/html
