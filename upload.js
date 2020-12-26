// configuration
app.use(express.static(__dirname + "/public")); // set the static files location /public/img will be /img for users
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(morgan("dev")); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

// file upload code
var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    // console.log(file);
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

var uploadMultiple = multer({
  //multer settings
  storage: storage,
}).array("file", 20);

var uploadSingle = multer({
  //multer settings
  storage: storage,
}).single("file");

app.get("*", function (req, res) {
  res.sendfile("./public/index.html"); // load our public/index.html file
});

/** API for single file upload */
app.post("/api/uploadPhoto", function (req, res) {
  uploadSingle(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.json(req.file);
  });
});

/** API for single file upload */
app.post("/api/uploadPhotos", function (req, res) {
  uploadMultiple(req, res, function (err) {
    if (err) {
      console.log(err);
      res.json({ error_code: 1, err_desc: err });
      return;
    }

    res.json(req.files);
  });
});
