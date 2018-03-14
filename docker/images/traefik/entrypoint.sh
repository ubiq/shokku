#!/bin/sh -e

echo "Sourcing env-secrets for docker secrets"
source env-secrets-expand.sh

echo "Using dockerize to update traefik and supervisord templates"
dockerize -template /traefik/traefik.tmpl.toml:/etc/traefik/traefik.toml
dockerize -template /traefik/supervisord.tmpl.conf:/etc/supervisor/supervisord.conf

echo "Starting supervisord daemon!"
exec supervisord --configuration /etc/supervisor/supervisord.conf