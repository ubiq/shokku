#!/bin/sh -e

echo "Recovering acme backup from S3"

echo "Sourcing env-secrets for docker secrets"
source env-secrets-expand.sh

if [ -z "/etc/traefik/acme.json" ]; then
    URL="s3://${S3_BUCKET}/${S3_PATH}/acme.json"
    echo "Trying to retrieve acme.json from ${URL}"
    s3cmd -c /etc/s3cmd/s3cfg --access_key=${S3_ACCESS_KEY} --secret_key=${S3_SECRET_KEY} get ${URL} /etc/traefik/acme.json --force
    echo 'Download complete'
fi