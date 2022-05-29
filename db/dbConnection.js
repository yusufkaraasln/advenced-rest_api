const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/restful_api", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB bağlantısı yapıldı"))
  .catch((e) => console.log(`Hata çıktı : ${e}`));
