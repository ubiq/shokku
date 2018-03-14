#!/bin/sh -e

URL="s3://${S3_BUCKET}/${S3_PATH}/acme.json"

echo "Sourcing env-secrets for docker secrets"
source env-secrets-expand.sh

downloadBackup() {
  echo "Recovering backup from S3"
  s3cmd -c /etc/s3cmd/s3cfg --access_key=${S3_ACCESS_KEY} --secret_key=${S3_SECRET_KEY} get ${URL} /usr/share/gubiq/ --force
  echo "Backup downloaded!"
}

echo 'Download complete'