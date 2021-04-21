const router = require("express").Router();
const adminController = require("../Controller/AdminController");
const { uploadSingle, uploadMultiple } = require("../middleware/multer");
router.get("/dashboard", adminController.viewDashboard);
//router category
router.get("/category", adminController.viewCategory);
router.delete("/category/:id", adminController.deleteCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
//ulasan
router.get("/ulasan", adminController.viewUlasan);
router.delete("/ulasan/:id", adminController.deleteUlasan);
//faq
router.get("/faq", adminController.viewFaq);
router.post("/faq", adminController.addFaq);

router.put("/faq", adminController.editFaq);
router.delete("/faq/:id", adminController.deleteFaq);
//produk
router.get("/produk", adminController.viewProduk);
router.post("/produk", uploadMultiple, adminController.addProduk);
router.delete("/produk/:id", adminController.deleteProduk);
router.get("/produk/image-details/:id", adminController.showImageProduk);
router.get("/produk/edit-produk/:id", adminController.showDetailsProduk);
router.put(
  "/produk/edit-produk/:id",
  uploadMultiple,
  adminController.editProduk
);
module.exports = router;
