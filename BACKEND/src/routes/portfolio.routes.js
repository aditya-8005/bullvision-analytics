const express = require("express");
const verifyJwt =require("../middlewares/authMiddleware");
const router = express.Router();

const {
    addHolding,
    getHoldings,
    updateHolding,
    deleteHolding,
}=require("../controllers/portfolioController");



router.post("/",verifyJwt,addHolding);
router.get("/:id", verifyJwt, getHoldings);
router.put("/:id", verifyJwt, updateHolding);
router.delete("/:id", verifyJwt, deleteHolding);
module.exports = router;