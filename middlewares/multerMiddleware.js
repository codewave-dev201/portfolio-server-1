// const cloudinary = require("../config/cloudinaryConfig");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// //Make sure only imagea re uploaded
// // const fileFilter = (req, file, cb) => {
// //     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
// //     if (allowedTypes.includes(file.mimetype)) {
// //         cb(null, true);
// //     } else {
// //         cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false);
// //     }
// // };

// // Cloudinary storage for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     const ext = file.mimetype.split("/")[1];
//     return {
//       folder: "fashion",
//       public_id: `${file.fieldname}-${Date.now()}`,
//       resource_type: "raw",
//       format: ext,
//     };
//   },
// });
// const upload = multer({
//     storage,
//     limits: { fileSize: 25 * 1024 * 1024 },
//     // fileFilter,
// });

// module.exports = upload;

const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/WEBP"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
  }
};

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.mimetype.split("/")[1];
    return {
      folder: "portfolio",
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: "image", // Ensure only images are uploaded
      format: ext, // Automatically detect format from file
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter,
});


module.exports = upload;

// const multer = require('multer');
// const {CloudinaryStorage} = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// require('dotenv').config();

// const{CLOUDINARY_CLOUD_NAME,  CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env;

// cloudinary.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//       folder: "products",
//       allowed_formats: ['jpg', 'png', 'jpeg']
//   }
// });

// const upload = multer({ storage: storage});
// module.exports = upload;


