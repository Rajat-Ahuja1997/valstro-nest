# valstro-nest

## Description
This Nest.js (written in TypeScript) application allows users to interact with a Socket.io wrapper of the Star Wars public REST API. 

### Install
```bash
$ npm install
```

### How to Run
1. Run the backend server and the client application (locally) separately 

Run the socket.io backend server: 
```bash
docker run -p 3000:3000 clonardo/socketio-backend
```
Run the client application
```bash
$ npm run start
```