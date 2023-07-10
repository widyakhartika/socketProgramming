/*
* Local interface address from which server listens for users.
* change it to suite your machine.
*/
const SERVER_HOST = "192.168.1.6";
/*
* Port number on which server listens for users.
* change it to which ever you want
*/
const SERVER_PORT = 8765;
const net = require('net');
// Maximum number of users that can be online at any time
const MAXIMUM_ONLINE_USERS = 100
// list of online users
userList = []
// create a TCP socket
serverSock = net.createServer(clientConnected);
// catch any socket error
serverSock.on('error', function(err) {
 if (err.code === 'EADDRINUSE') {
 console.log("Error: port %d is in use, check if another instance 
of the server is running or wait for a few seconds and rerun the server", 
SERVER_PORT);
 } else {
 console.log("server socket error:", err.code);
 }
});
/* listen for the user connections */
serverSock.listen(SERVER_PORT, SERVER_HOST, function() {
 console.log('Server listening on %s:%d', SERVER_HOST, SERVER_PORT);
});
/* User messages handling functions */
function clientConnected(clientSocket) {
 if (userList.length >= MAXIMUM_ONLINE_USERS) {
 clientSocket.end();
 }
 clientSocket.on('error', function(err) {
 clientSocket.destroy(err);
 });
 clientSocket.on('data', function(buffer) {
 /* broadcast the message to all other users */
 broadcastMessage(clientSocket, buffer);
 });
 /* user closes the connection, remoe the user from the list*/
 clientSocket.on('end', function() {
 /* remove the user from the list */
 userList.splice(userList.indexOf(clientSocket), 1);
 });
 clientSocket.on('close', function(err) {
 if (err) {
 console.log('Connection closed due to socket error');
 }
 });
 /* add the user to the list */
 userList.push(clientSocket);
}
/*broadcast user message to all other online users */
function broadcastMessage(from, message) {
 if (userList.length === 0) {
 return;
 }
 userList.forEach(function(userSocket) {
 if (userSocket === from) {
 return;
 }
 userSocket.write(message);
 });
}