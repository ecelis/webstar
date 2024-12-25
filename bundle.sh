#!/bin/env sh

cd web
yarn build
cp -v build/*.{json,png,txt,ico} ../api/static
cp -rv build/static/* ../api/static
cp -v build/index.html ../api/frontend/templates/frontend
