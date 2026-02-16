#!/bin/bash

cd /Users/user/Desktop/Brand\ Management\ /cdt-jamaica-repertoire/cdt-sanity

echo "Starting Sanity deployment..."
echo "Using SANITY_AUTH_TOKEN from .env.local"

# Export the token from .env.local
export SANITY_AUTH_TOKEN=$(grep SANITY_AUTH_TOKEN ../../.env.local | cut -d '=' -f2)

echo "Running sanity deploy..."
npx sanity deploy

echo "Deployment process completed."
