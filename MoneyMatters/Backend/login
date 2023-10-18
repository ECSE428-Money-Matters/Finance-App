const loginAttempts = {};

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (loginAttempts[username] >= 3) {
            return res.json("Too many login attempts. Select 'Forgot Password' to proceed.");
        }

        const user = await pool.query("SELECT * FROM Account WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.json("Username not found");
        }

        if (user.rows[0].password !== password) {
            loginAttempts[username] = (loginAttempts[username] || 0) + 1;
            return res.json("Invalid password");
        }

        // Reset login attempts
        loginAttempts[username] = 0;

        res.json("Login successful");

    } catch (err) {
        console.error(err.message);
    }
});

app.post("/logout", (req, res) => {
    // Not much to do here
    res.json("Logout successful");
});