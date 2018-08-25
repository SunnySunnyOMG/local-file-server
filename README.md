# local-file-server


## usage 
 ### install Node.js
 1. install [Node Version Manager](https://github.com/creationix/nvm#node-version-manager---)
 ```js
 curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
 ```
 for more intallation tips, please see https://github.com/creationix/nvm#installation
 
 2. install node 10.7.0 to use modern features
 ```
 nvm install 10.7.0
 ```
 
 3. check node installation
 ```
 nvm ls
 ```
 
 4. if you can see the node v10.7.0 in the list, then run
 ```
 nvm use 10.7.0
 ```
 
### install dependecies
under project folder, run:
``` js
npm install
```
### run local server
under project folder, run:
```js
node index.js
```
