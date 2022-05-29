const hatayiYakala = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.json({
      mesaj:
        Object.keys(err.keyValue) +
        " için girdiğiniz " +
        Object.values(err.keyValue) +
        " daha önceden veritabanında olduğundan tekrardan eklenemez/güncellenemez (unique olmalıdır).",
      errCode: 400,
    });
  }
  if (err.kind === "ObjectId") {
    return res.json({
      mesaj: "Değiştirelemez bir alanı güncellemeye çalıştınız.",
      errCode: 400,
    });
  }
  console.log(err);
  res.status(err.statusCode || 500);
  res.json({
    errCode: err.statusCode || 500,
    mesaj: err.message,
  });
};

module.exports = hatayiYakala;
