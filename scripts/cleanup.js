#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killProcessOnPort(port) {
  try {
    console.log(`🧹 Checking for processes on port ${port}...`);
    
    // Find processes using the port
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length === 0) {
      console.log(`✅ Port ${port} is free`);
      return;
    }
    
    console.log(`🔫 Killing ${pids.length} process(es) on port ${port}:`, pids.join(', '));
    
    // Kill the processes
    for (const pid of pids) {
      await execAsync(`kill -9 ${pid}`);
    }
    
    console.log(`✅ Successfully freed port ${port}`);
    
  } catch (error) {
    if (error.message.includes('No such process')) {
      console.log(`✅ Port ${port} is already free`);
    } else {
      console.log(`ℹ️  Port ${port} appears to be free (no processes found)`);
    }
  }
}

// Clean up common development ports
async function cleanup() {
  console.log('🚀 MAIO Backend Cleanup Starting...\n');
  
  await killProcessOnPort(3001);
  await killProcessOnPort(3002);
  
  console.log('\n✅ Cleanup complete! Ports are ready for development.');
}

cleanup().catch(console.error);
