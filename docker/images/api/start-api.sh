#!/bin/sh -e

cd /var/www/api
yarn run prestart:prod
yarn run start:prod
