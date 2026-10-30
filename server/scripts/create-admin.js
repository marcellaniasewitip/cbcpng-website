/**
 * Create an admin account, or reset the password of an existing one.
 *
 *   npm run create-admin
 *
 * Or without prompts (e.g. on a server):
 *   ADMIN_NAME="Jane Doe" ADMIN_EMAIL=jane@cbcpng.org ADMIN_PASSWORD="a-long-password" npm run create-admin
 */
require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { pool } = require('../src/db');

async function ask() {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    return { name: process.env.ADMIN_NAME || 'Administrator', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
  const it = rl[Symbol.asyncIterator]();
  const q = async (text) => { process.stdout.write(text); const { value } = await it.next(); return (value || '').trim(); };
  const name = await q('Full name: ');
  const email = await q('Email: ');
  const password = await q('Password (at least 10 characters): ');
  rl.close();
  return { name, email, password };
}

(async () => {
  try {
    const { name, email: rawEmail, password } = await ask();
    const email = rawEmail.toLowerCase();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
      throw new Error('Enter a name, a valid email and a password of at least 10 characters.');
    }
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO admins (full_name, email, password_hash) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash)`,
      [name, email, hash],
    );
    console.log(`\nAdmin ready: ${email}. Sign in at /admin`);
  } catch (err) {
    console.error(`\n${err.message}`);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
