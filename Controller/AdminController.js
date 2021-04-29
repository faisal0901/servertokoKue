const knex = require("../Models/koneksi");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  viewDashboard: async (req, res) => {
    try {
      res.render("admin/view_dashboard");
    } catch (error) {}
  },
  viewLogin: async (req, res) => {
    try {
      res.render("admin/view_dashboard");
    } catch (error) {}
  },
  viewCategory: async (req, res) => {
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      const category = await knex.select("*").from("kategori");

      res.render("admin/Category/view_category", { category, alert });
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { kategoriName } = req.body;
      await knex("kategori").insert({ kategoriName });
      req.flash("alertMassage", `data berhasil di tambah`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/Category/");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await knex("kategori").where("id", id).del();
      req.flash("alertMassage", `data berhasil di hapus`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/Category/");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { kategoriId, kategoriName } = req.body;

      await knex("kategori")
        .where("id", "=", kategoriId)
        .update({
          kategoriName,
        })
        .clearCounters();
      req.flash("alertMassage", `data berhasil di ubah`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/Category");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  viewUlasan: async (req, res) => {
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      const ulasan = await knex.select("*").from("Ulasan");
      console.log(ulasan);
      res.render("admin/Ulasan/view_ulasan", { alert, ulasan });
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  deleteUlasan: async (req, res) => {
    try {
      const { id } = req.params;
      await knex("Ulasan").where("id", id).del();
      req.flash("alertMassage", `data berhasil di hapus`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/ulasan/");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  viewFaq: async (req, res) => {
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      const faq = await knex.select("*").from("faq");
      res.render("admin/Faq/view_faq", { faq, alert });
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  addFaq: async (req, res) => {
    try {
      const { tanya, jawab } = req.body;
      await knex("faq").insert({ tanya, jawab });
      req.flash("alertMassage", `data berhasil di tambah`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/faq/");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  deleteFaq: async (req, res) => {
    try {
      const { id } = req.params;
      await knex("faq").where("id", id).del();
      req.flash("alertMassage", `data berhasil di hapus`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/faq/");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  editFaq: async (req, res) => {
    try {
      const { tanya, jawab, id } = req.body;

      await knex("faq")
        .where("id", "=", id)
        .update({
          tanya: tanya,
          jawab: jawab,
        })
        .clearCounters();
      req.flash("alertMassage", `data berhasil di ubah`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/faq/");
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  viewProduk: async (req, res) => {
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      const produk = await knex("produk")
        .join("kategori", "produk.kategoriId", "kategori.id")
        .select("produk.*", "kategori.kategoriName");

      const category = await knex.select("*").from("kategori");
      res.render("admin/Produk/view_produk", {
        alert,
        produk,
        category,
      });
    } catch (error) {
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  addProduk: async (req, res) => {
    try {
      const {
        namaProduk,
        harga,
        ukuran,
        stok,
        kategoriId,
        deskripsi,
      } = req.body;
      if (req.files) {
        await knex("produk").insert({
          namaProduk,
          harga,
          ukuran,
          stok,
          kategoriId,
          deskripsi,
          create_at: new Date(),
        });
        const id = await knex("produk").orderBy("create_at", "desc");
        const idProduk = id[0].id;
        for (let i = 0; i < req.files.length; i++) {
          await knex("ImagesProduct").insert({
            ImagesUrl: `images/${req.files[i].filename}`,
            ProdukId: idProduk,
          });
        }
        res.redirect("/admin/produk");
        req.flash("alertMassage", `data berhasil di ditambahkan`);
        req.flash("alertStatus", "success");
      }
    } catch (error) {
      console.log("eror=>", error);
      req.flash("alertMassage", error);
      req.flash("alertStatus", "danger");
    }
  },
  deleteProduk: async (req, res) => {
    try {
      const { id } = req.params;
      const image = await knex("ImagesProduct").where("ProdukId", id);
      if (image) {
        for (let i = 0; i < image.length; i++) {
          fs.unlink(path.join(`public/${image[i].ImagesUrl}`));
        }
      }
      await knex("ImagesProduct").where("ProdukId", id).del();
      await knex("produk").where("id", id).del();
      res.redirect("/admin/produk");
      req.flash("alertMassage", `data berhasil di hapus`);
      req.flash("alertStatus", "success");
    } catch (error) {
      console.log(error);
    }
  },
  showImageProduk: async (req, res) => {
    try {
      const { id } = req.params;
      const image = await knex("ImagesProduct").where("ProdukId", id);
      console.log(image);
      res.render("admin/Produk/show_image", { image });
    } catch (error) {
      console.log(error);
    }
  },
  showDetailsProduk: async (req, res) => {
    try {
      const { id } = req.params;
      const produk = await knex("produk")
        .join("kategori", "produk.kategoriId", "kategori.id")
        .select("produk.*", "kategori.kategoriName")
        .where("produk.id", id);
      const category = await knex.select("*").from("kategori");
      res.render("admin/Produk/edit_produk", { produk, category });
    } catch (error) {
      console.log(error);
    }
  },
  editProduk: async (req, res) => {
    const { id } = req.params;

    try {
      const {
        namaProduk,
        harga,
        ukuran,
        stok,
        kategoriId,
        deskripsi,
      } = req.body;

      if (req.files.length > 0) {
        const image = await knex("ImagesProduct").where("ProdukId", id);

        if (image) {
          for (let i = 0; i < image.length; i++) {
            fs.unlink(path.join(`public/${image[i].ImagesUrl}`));
            await knex("ImagesProduct")
              .where("ImagesUrl", "=", image[i].ImagesUrl)
              .del();
            // .update({
            //   ImagesUrl: `images/${req.files[i].filename}`,
            // });
            await knex("ImagesProduct").insert({
              ImagesUrl: `images/${req.files[i].filename}`,
              ProdukId: id,
            });
          }
          await knex("produk")
            .where("id", "=", id)
            .update({
              namaProduk,
              harga,
              ukuran,
              stok,
              kategoriId,
              deskripsi,
              create_at: new Date(),
            })
            .clearCounters();
          res.redirect("/admin/produk");
        }
      } else {
        await knex("produk").where("id", "=", id).update({
          namaProduk,
          harga,
          ukuran,
          stok,
          kategoriId,
          deskripsi,
          create_at: new Date(),
        });

        res.redirect("/admin/produk");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
