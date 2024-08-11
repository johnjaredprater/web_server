#!/bin/bash

NEW_TAG=$1
K8S_DEPLOYMENT_FILE=flux-kustomization.yaml

# Replace the old image tag with the new tag
sed -i "s|image: johnjaredprater/web_server:.*|image:johnjaredprater/web_server:$NEW_TAG|g" $K8S_DEPLOYMENT_FILE

# Commit the changes
git add $K8S_DEPLOYMENT_FILE
git commit -m "Update Kubernetes deployment to use Docker image tag $NEW_TAG"
git push origin main