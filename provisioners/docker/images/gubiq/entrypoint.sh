#!/bin/sh -e

echo "Using dockerize to supervisord templates"
dockerize -template /gubiq/supervisord.tmpl.conf:/etc/supervisor/supervisord.conf

echo "Starting supervisord daemon!"
exec supervisord --configuration /etc/supervisor/supervisord.conf
