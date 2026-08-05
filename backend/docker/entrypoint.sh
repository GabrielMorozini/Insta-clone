#!/bin/bash
set -e

# Executa otimizações de cache (se for Laravel)
# php artisan config:cache
# php artisan route:cache

# Inicia o processo principal do contêiner (ex: php-fpm ou apache)
exec "$@"