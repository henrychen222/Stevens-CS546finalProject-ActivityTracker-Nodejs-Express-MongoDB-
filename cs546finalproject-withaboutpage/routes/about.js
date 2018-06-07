const express = require("express");
const router = express.Router();
const data = require("../data");
const authorsData = data.authors;

router.get("/authors", async (req, res) => {
	try{
        const authorStats = await authorsData.createAuthors(req.params.name, req.params.CWID, req.params.email, req.params.work);
        res.render("main/about", {authorStats : name, authorStats : CWID, authorStats : email, authorStats : work});
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;