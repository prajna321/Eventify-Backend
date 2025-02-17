const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.uploadProfilePicture = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }


    const uploadedImage = await uploadImageToCloudinary(req.file.buffer, "profile_pictures");

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: uploadedImage.secure_url,
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};
