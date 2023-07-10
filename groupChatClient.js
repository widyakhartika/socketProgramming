/* group server address, change this as in groupChatServer.js SERVER_HOST 
*/
const SERVER_HOST = "192.168.1.6";
/* group server port number, change this as in groupChatServer.js 
SERVER_PORT */
const SERVER_PORT = 8765;
/* Prompt on the client side where you type the message */
const PROMT = "me>"
/*
* your name, message will be sent with this name, this will changed to
* username from the command line if given
*/
var userName = "unknown"
var stdin = process.openStdin();
const net = require('net');
if (process.argv[2])
 userName = process.argv[2];
const socket = net.createConnection(SERVER_PORT, SERVER_HOST, function() 
{
 socket.on('data', function(message) {
 process.stdout.write("\n" + message);
 process.stdout.write(PROMT);
 });
 process.stdout.write(PROMT);
 stdin.addListener('data', function(message) {
 socket.write(userName + ">" + message);
 process.stdout.write(PROMT);
 });
});
socket.on('error', function(err) {
 if (err.code === 'ECONNREFUSED')
 console.log("Error:connection refused, please check the server is 
running");
 else
 console.log("\nsocket error:", err.code);
});
socket.on('close', function(err) {
 if (err) {
 console.log('\nclient closed due to error');
 } else {
 console.log('\nserver closes the client connection');
 }
 process.exit(err ? 1 : 0);
});
