require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

const PORT = process.env.PORT || 5000;

// Optional admin seed (env me ADMIN_EMAIL / ADMIN_PASSWORD ho to)
async function seedAdmin() {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
    const exists = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (exists) return;
    await User.create({
        name: ADMIN_NAME || 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
}

(async() => {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();