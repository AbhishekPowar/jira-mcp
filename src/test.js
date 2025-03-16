#!/usr/bin/env node

import { spawn } from 'child_process';

// Create a JSON-RPC request to call the hello_world tool
const request = {
  jsonrpc: '2.0',
  id: '1',
  method: 'callTool',
  params: {
    name: 'hello_world',
    arguments: {
      name: 'Test User'
    }
  }
};

// Spawn the server process
const serverProcess = spawn('node', ['src/server.js']);

// Send the request to the server's stdin
serverProcess.stdin.write(JSON.stringify(request) + '\n');

// Listen for the response on stdout
serverProcess.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
  serverProcess.kill(); // Kill the server after getting the response
});

// Handle errors
serverProcess.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString());
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(0);
}); 