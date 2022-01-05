const fs = require('fs')
fs.writeFileSync('./.env', `TYPESENSE_API_KEY=${process.env.TYPESENSE_API_KEY}\n`)