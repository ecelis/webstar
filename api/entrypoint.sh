#!/bin/sh

set -e

echo "${0}: running migrations."
python3 manage.py migrate --noinput

exec "$@"

