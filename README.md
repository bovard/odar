# Of Dust and Rocks

Our entry to 7DRL 2017

## Local Development

Make sure you have node and npm installed.

```
npm install -g browserify
cd odar/
npm install
```

Then you simply build the project and start a simple server:
```
npm run build
npm run serve
```
Open your browser to localhost:8000 and tada! As you make changes you'll have to run `npm run build` again.

### Problems:

```
Error: EMFILE, open '/.../node_modules/react-bootstrap/package.json'
```
Your file limit it too low for browserify, fix it with:
```
ulimit -n 2560
```
