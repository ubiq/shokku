#!/bin/sh -e

echo "Performing a backup"

echo "Sourcing env-secrets for docker secrets"
source env-secrets-expand.sh

if [ -e "/etc/traefik/acme.json" ]; then
    URL="s3://${S3_BUCKET}/${S3_PATH}/"
    echo "Uploading acme.json to ${URL}"
    s3cmd -c /etc/s3cmd/s3cfg --access_key=${S3_ACCESS_KEY} --secret_key=${S3_SECRET_KEY} put -f /etc/traefik/acme.json ${URL}
    echo 'Upload complete'
else
    echo 'No acme.json file detected. Doing nothing'
fi