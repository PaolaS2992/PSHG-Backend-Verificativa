exports.port = process.env.PORT || process.argv[2] || 3000;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/verificativaLocal';
exports.secret = process.env.JWT_SECRET || 'api-verificativa-local';
exports.adminEmail = process.env.ADMIN_EMAIL || 'local@verificativa.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'local';
