const router = require("express").Router();
const apiController = require("../Controller/ApiController");
router.get("/homepage", apiController.homePage);
router.get("/detail/:id", apiController.detailsProduk);
router.get("/category/:id", apiController.getProdukByCategory);
router.post("/register", apiController.register);
module.exports = router;
