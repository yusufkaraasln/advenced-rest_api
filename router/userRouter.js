const User = require("../models/userModel");
const createError = require("http-errors");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const authMiddleWare = require("../middleware/authMiddleWare");
const adminMiddleWare = require("../middleware/adminMiddleWare");

router.get("/", [authMiddleWare,adminMiddleWare], async (req, res) => {
  const tumUserlar = await User.find();
  res.json(tumUserlar);
});

router.get("/me", authMiddleWare, (req, res, next) => {
  res.json(req.user);
});

router.post("/", async (req, res, next) => {
  try {
    const eklenecekUser = new User(req.body);
    eklenecekUser.sifre = await bcrypt.hash(eklenecekUser.sifre, 10);
    const { error, sonuc } = eklenecekUser.joiValidation(req.body);
    if (error) {
      next(error);
      console.log(error);
    } else {
      const sonuc = await eklenecekUser.save();
      res.json(sonuc);
    }
  } catch (e) {}
});

router.patch("/:id", async (req, res, next) => {
  delete req.body.createdAt;
  delete req.body.updatedAt;

  if (req.body.hasOwnProperty("sifre")) {
    req.body.sifre = await bcrypt.hash(req.body.sifre, 10);
  }

  const { error, value } = User.joiValidationForUpdate(req.body);
  if (error) {
    next(createError(400, error));
  } else {
    try {
      const sonuc = await User.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (sonuc) {
        return res.json(sonuc);
      } else {
        return res.status(404).json({
          mesaj: "Kullanici Guncellenemedi.",
        });
      }
    } catch (e) {
      next(e);
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const sonuc = await User.findByIdAndDelete({ _id: req.params.id });
    if (sonuc) {
      return res.json({
        mesaj: `${req.params.id} Kullanicisi silindi.`,
      });
    } else {
      // res.status(404).json({
      //   mesaj: "Kullanıcı bulunamadı.",
      // });
      // const errObj = new Error("Kullanıcı Bulunamadı")
      // errObj.errCode = 404

      throw createError(404, "Kullanıcı Bulunamadı");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/deleteAll", [authMiddleWare,adminMiddleWare],async (req, res, next) => {
  try {
    const sonuc = await User.deleteMany({ isAdmin:false });
    if (sonuc) {
      return res.json({
        mesaj: "Adminler Hariç Tüm Kullanıcılar Silindi.",
      });
    } else {
      // res.status(404).json({
      //   mesaj: "Kullanıcı bulunamadı.",
      // });
      // const errObj = new Error("Kullanıcı Bulunamadı")
      // errObj.errCode = 404

      throw createError(404, "Silme işlemi başarısız.");
    }
  } catch (e) {
    next(e);
  }
});

router.post("/giris", async (req, res, next) => {
  try {
    const user = await User.girisYap(req.body.email, req.body.sifre);
    const token = await user.generateToken();

    res.json({
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
