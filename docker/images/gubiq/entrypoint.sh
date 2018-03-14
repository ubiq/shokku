#!/bin/sh -e

echo "Sourcing env-secrets for docker secrets"
source env-secrets-expand.sh

echo "Using dockerize to supervisord templates"
dockerize -template /gubiq/supervisord.tmpl.conf:/etc/supervisor/supervisord.conf

echo "Trying to download latest version of the blockchain backup"

echo "Starting supervisord daemon!"
exec supervisord --configuration /etc/supervisor/supervisord.conf