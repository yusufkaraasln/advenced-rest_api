require("./db/dbConnection");
const hataMiddleware = require("./middleware/hataMiddleware");
const express = require("express");
const app = express();

const useRouter = require("./router/userRouter");

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/users", useRouter);

app.get("/", (req, res) => {
  res.json({ mesaj: "hoşgeldiniz" });
});

app.use(hataMiddleware);

 

app.listen(3000, () =>
  console.log("> Server is up and running on port : " + 3000)
);
