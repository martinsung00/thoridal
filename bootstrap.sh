# Install dependencies.
npm install

# Initialize.
npm run build

# Transpile and pack.
npm run bundle

# Sanity check.
npm run type-check

# Create the database, role, and privileges.
createuser service
createdb trades

# Perform migrations.
npm run migrate up

# Run the tests.
npm run test