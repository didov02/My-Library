const indexPage = (req, res) => {
    try {
        const username = req.user.username;
        res.render('index', { username : username });
    } catch (err) {
        console.error("Error rendering index page:", err);
        res.status(500).send("An error occurred while loading the home page.");
    }
};

module.exports = indexPage;