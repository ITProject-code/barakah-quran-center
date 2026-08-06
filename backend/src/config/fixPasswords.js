const bcrypt = require('bcryptjs')
const pool = require('./database')

async function fixPasswords() {
  const client = await pool.connect()
  
  try {
    // Generate proper password hashes
    const adminPassword = await bcrypt.hash('admin123', 10)
    const teacherPassword = await bcrypt.hash('teacher123', 10)
    
    console.log('Admin hash:', adminPassword)
    console.log('Teacher hash:', teacherPassword)
    
    // Update admin password
    await client.query(
      "UPDATE users SET password = $1 WHERE email = 'admin@barakah.com'",
      [adminPassword]
    )
    console.log('✅ Admin password updated')
    
    // Update teacher password
    await client.query(
      "UPDATE users SET password = $1 WHERE email = 'teacher@barakah.com'",
      [teacherPassword]
    )
    console.log('✅ Teacher password updated')
    
    // Verify
    const result = await client.query(
      "SELECT email, password FROM users ORDER BY email"
    )
    console.log('📋 Updated users:', result.rows)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

fixPasswords()