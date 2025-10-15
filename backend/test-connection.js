require('dotenv').config();
const { sequelize } = require('./config/database');

async function testConnection() {
  console.log('🔄 Testing MySQL connection...\n');
  
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST || '127.0.0.1');
  console.log('  Port:', process.env.DB_PORT || 3306);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  User:', process.env.DB_USER);
  console.log('  Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
  console.log('');

  try {
    // Test authentication
    await sequelize.authenticate();
    console.log('✅ MySQL connection successful!');
    
    // Test query execution
    const [results] = await sequelize.query('SELECT 1 + 1 as result');
    console.log('✅ Query test passed:', results[0]);
    
    // Test database access
    const [databases] = await sequelize.query('SHOW DATABASES');
    console.log('✅ Available databases:', databases.length);
    
    // Check if our database exists
    const dbExists = databases.some(db => 
      db.Database === process.env.DB_NAME
    );
    
    if (dbExists) {
      console.log(`✅ Database "${process.env.DB_NAME}" exists`);
      
      // Check tables
      const [tables] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      `);
      
      if (tables.length > 0) {
        console.log('✅ Tables found:', tables.map(t => t.TABLE_NAME).join(', '));
      } else {
        console.log('⚠️  No tables found yet (will be created on server start)');
      }
    } else {
      console.log(`❌ Database "${process.env.DB_NAME}" does NOT exist!`);
      console.log('\n📝 Create it with:');
      console.log(`   mysql -u ${process.env.DB_USER} -p`);
      console.log(`   CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`   EXIT;`);
    }
    
    console.log('\n✅ All tests passed! Your database is ready.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Verify credentials in backend/.env file');
    console.error('3. Create database if it doesn\'t exist');
    console.error('4. Check if user has correct permissions');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MySQL server is not running. Start it with:');
      console.error('   • macOS: brew services start mysql');
      console.error('   • Windows: net start MySQL');
      console.error('   • Linux: sudo systemctl start mysql');
    }
    
    if (error.message.includes('Access denied')) {
      console.error('\n💡 Credentials are incorrect. Check:');
      console.error('   • DB_USER in .env');
      console.error('   • DB_PASSWORD in .env');
    }
    
    if (error.message.includes('Unknown database')) {
      console.error('\n💡 Database doesn\'t exist. Create it:');
      console.error(`   mysql -u ${process.env.DB_USER} -p`);
      console.error(`   CREATE DATABASE ${process.env.DB_NAME};`);
    }
    
    process.exit(1);
  }
}

testConnection();