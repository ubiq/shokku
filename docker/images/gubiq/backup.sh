#!/bin/sh -e

if [[ -z "${GUBIQ_BACKUP_NODE}" ]]; then
  echo "Gugibq node not configured to backup. Exiting backup script!"
  exit 0
fi

# Load script
echo "Sourcing env-secrets for docker secrets"
source env-secrets-expand.sh

# Create a random directory
WORK_DIR=`mktemp -d`
echo "Created temp directory: $WORK_DIR"

# Set backup file name
BACKUP_FILE="gubiq.chain.$(date +"%Y-%m-%d")"

cd $WORK_DIR

# check if random dir inside /tmp was created
if [[ ! "$WORK_DIR" || ! -d "$WORK_DIR" ]]; then
  echo "Could not create temp dir. Backup not possible."
  exit 1
fi

# deletes the temp directory
function cleanup() {      
  rm -rf "$WORK_DIR"
  echo "Deleted temp working directory $WORK_DIR"
  startGubiq
  echo "Bye!"
}

stopGubiq() {
  echo "Stopping Gubiq daemon"
  supervisorctl stop gubiq
}

startGubiq() {
    echo "Starting Gubiq daemon"
    supervisorctl start gubiq
}

createBackup() {
  echo "Creating gubiq backup"
  gubiq $GUBIQ_NET export $BACKUP_FILE

  echo "Generating SHA1 of the backup"
  sha1sum $BACKUP_FILE > $BACKUP_FILE.sha1

  echo "Compressing files..."
  tar -czvf $BACKUP_FILE.gz .
}

uploadBackup() {
  echo "Sending to S3"
  URL="s3://${S3_BUCKET}/${S3_PATH}/"
  s3cmd -c /etc/s3cmd/s3cfg --access_key=${S3_ACCESS_KEY} --secret_key=${S3_SECRET_KEY} put -f "$BACKUP_FILE.gz" $URL
  echo "Backup sent!"
}

# register the cleanup function to be called on the EXIT signal
trap cleanup EXIT

# Start process
stopGubiq
createBackup
uploadBackup
uploadBackup