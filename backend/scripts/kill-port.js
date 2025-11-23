const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function killPort(port = 5000) {
  try {
    // Try to find process on port
    const { stdout } = await execPromise(`lsof -ti:${port} || echo ""`);
    const pid = stdout.trim();

    if (!pid) {
      console.log(`✅ Port ${port} sudah bebas`);
      return;
    }

    console.log(`🔍 Menemukan proses dengan PID: ${pid}`);
    console.log(`🛑 Menghentikan proses...`);

    try {
      await execPromise(`kill ${pid}`);
      console.log(`✅ Proses berhasil dihentikan`);
    } catch (error) {
      // Try force kill
      console.log(`⚠️  Menggunakan force kill...`);
      await execPromise(`kill -9 ${pid}`);
      console.log(`✅ Proses berhasil dihentikan (force)`);
    }

    // Verify
    await new Promise(resolve => setTimeout(resolve, 500));
    const { stdout: check } = await execPromise(`lsof -ti:${port} || echo ""`);
    
    if (!check.trim()) {
      console.log(`✅ Port ${port} sekarang bebas`);
    } else {
      console.log(`⚠️  Port ${port} masih digunakan`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nCara manual:');
    console.log(`1. Cari PID: lsof -i :${port}`);
    console.log(`2. Kill: kill <PID>`);
  }
}

const port = process.argv[2] || 5000;
killPort(port);

