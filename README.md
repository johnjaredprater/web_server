# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

```
npm install --global git-conventional-commits
```

Assuming pipenv is set-up, you can use pip to install pre-commit:
```
pip install pre-commit
pre-commit install -t commit-msg
```

To install dependencies, use
```
npm install
```

Run the app in the development mode with:
```
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Run the test runner in the interactive watch mode with:
```
npm test
```
More info [in the docs](https://facebook.github.io/create-react-app/docs/running-tests)

To build the app for production in the `build` folder use

```
npm run build
```

### Containerize & Push

Build with the following command (when at the root of the repo)
```bash
export IMAGE_TAG=johnjaredprater/web_server:$(git rev-parse HEAD)
docker build -t $IMAGE_TAG .
```

Run the app with
```bash
docker run -p 3000:3000 -t $IMAGE_TAG
```

Push to dockerhub with
```bash
docker push $IMAGE_TAG
```

Push from dockerhub with
```bash
sudo docker pull $IMAGE_TAG
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
