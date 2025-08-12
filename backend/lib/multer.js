import multerS3 from "multer-s3";
import s3 from "./s3.js";
import mime from "mime-types";

export const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: "public-read",
  contentType: function (req, file, cb) {
    const mimeType =
      mime.lookup(file.originalname) || "application/octet-stream"; // Defaults to octet-stream
    cb(null, mimeType);
  },
  key: function (req, file, cb) {
    const fileName = Date.now().toString() + "-" + file.originalname;
    cb(null, fileName);
  },
});
