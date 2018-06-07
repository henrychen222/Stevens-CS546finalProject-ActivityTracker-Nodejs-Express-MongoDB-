const express = require("express");
const router = express.Router();
const data = require("../data");
const activityTypeData = data.activityTypes;

router.get("/api/activitytype/:id", async (req, res) => {
    try{
        const activityList = await activityTypeData.getActivtyTypesById(req.params.id);
        res.json(activityList);
    } catch (e) {
        res.status(404).json({ message: "Activity Type not found" });
    }

});


module.exports = router;
