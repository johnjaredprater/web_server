#!/bin/bash

NEW_TAG=$1
K8S_DEPLOYMENT_FILE=deployment.yaml

# Replace the old image tag with the new tag
sed -i "s|image: johnjaredprater/web_server:.*|image:johnjaredprater/web_server:$NEW_TAG|g" $K8S_DEPLOYMENT_FILE

# hmm
git config user.name github-actions
git config user.email github-actions@github.com

# Commit the changes
git add $K8S_DEPLOYMENT_FILE
git commit -m "chore: Update Kubernetes deployment to use Docker image tag $NEW_TAG"
git push https://github-actions:${GITHUB_TOKEN}@github.com/johnjaredprater/web_server.git main