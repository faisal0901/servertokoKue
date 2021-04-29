const knex = require("../Models/koneksi");
const bcrypt = require("bcryptjs");
module.exports = {
  homePage: async (req, res) => {
    try {
      const category = await knex.select("*").from("kategori");
      const data = await knex("produk")
        .join("kategori", "produk.kategoriId", "kategori.id")
        .select(
          "produk.namaProduk",
          "kategori.kategoriName",
          "produk.harga",
          "produk.id"
        );
      const produk = [];
      data.forEach((val, index) => {
        knex
          .select("*")
          .from("ImagesProduct")
          .where("ProdukId", val.id)
          .then((response) => {
            produk.push({
              namaProduk: val.namaProduk,
              ukuran: val.ukuran,
              harga: val.harga,
              stok: val.stok,
              kategoriId: val.kategoriId,
              deskripsi: val.deskripsi,
              ImageUrl: response,
            });
          });
      });

      const testimony = await knex.select("*").from("Ulasan");
      const faq = await knex.select("*").from("faq").limit("5");
      res.status(200).json({
        header: { title: "Ngemil Yuk", subTitle: "cari produk yang kamu mau" },
        category,
        produk,
        testimony,
        faq,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ masage: error });
    }
  },
  detailsProduk: async (req, res) => {
    try {
      const { id } = req.params;

      const produk = await knex("produk")
        .join("kategori", "produk.kategoriId", "kategori.id")
        .where("produk.id", id);
      const image = await knex
        .select("*")
        .from("ImagesProduct")
        .where("ProdukId", id);
      const data = [];
      produk.forEach((val, index) => {
        data.push({
          id: val.id,
          namaProduk: val.namaProduk,
          ukuran: val.ukuran,
          harga: val.harga,
          stok: val.stok,
          kategoriId: val.kategoriId,
          deskripsi: val.deskripsi,
          ImageUrl: image,
        });
      });
      const rawData = await knex("produk")
        .join("kategori", "produk.kategoriId", "kategori.id")
        .select(
          "produk.namaProduk",
          "kategori.kategoriName",
          "produk.harga",
          "produk.id"
        )

        .limit(4);
      const other = [];
      for (let i = 0; i < rawData.length; i++) {
        let image = await knex
          .select("*")
          .from("ImagesProduct")
          .where("produkId", rawData[i].id);
        other.push({
          id: rawData[i].id,
          namaProduk: rawData[i].namaProduk,
          harga: rawData[i].harga,
          kategoriId: rawData[i].kategoriId,
          deskripsi: rawData[i].deskripsi,
          imagesUrl: image,
        });
      }

      res.json({ data, other }).status(200);
    } catch (error) {
      console.log(error);
    }
  },
  getProdukByCategory: async (req, res) => {
    const { id } = req.params;
    const data = await knex("produk")
      .join("kategori", "produk.kategoriId", "kategori.id")
      .where("produk.kategoriId", id)

      .select("produk.*");
    const produk = [];
    for (let i = 0; i < data.length; i++) {
      let image = await knex
        .select("*")
        .from("ImagesProduct")
        .where("produkId", data[i].id);
      produk.push({
        id: data[i].id,
        namaProduk: data[i].namaProduk,
        harga: data[i].harga,
        kategoriId: data[i].kategoriId,
        deskripsi: data[i].deskripsi,
        imagesUrl: image,
      });
    }
    res.json({ produk }).status(200);
  },
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const checkUser = await knex
        .select("*")
        .from("user")
        .where("email", email);

      if (checkUser.length === 0) {
        await knex("user").insert({
          username,
          email,
          password: await bcrypt.hash(password, 8),
          Create_at: new Date(),
        });
        res.json({ massage: "data berhasil di registrasi" });
      } else {
        res.json({ massage: "email sudah terdaftar" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
