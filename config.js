// exports.port = process.argv[2] || process.env.PORT || 8080;
exports.port = 8080 || process.argv[2] || process.env.PORT;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/verificativaLocal';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-verificativa';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@verificativa.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'verificativa';
