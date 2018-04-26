#!/bin/sh -e

cd /var/www/api
yarn install
yarn run start:dev
