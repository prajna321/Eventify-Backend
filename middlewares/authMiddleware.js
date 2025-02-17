const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

exports.auth = async (req, res, next) => {
	try {
	
		let token =
			req.cookies?.token ||
			req.body?.token ||
			(req.header("Authorization")?.startsWith("Bearer ")
				? req.header("Authorization").replace("Bearer ", "")
				: null);


		if (!token) {
			return res.status(401).json({ success: false, message: "Token is missing" });
		}

		try {
		
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			
		
			const user = await User.findById(decoded.id).select("-password");
			if (!user) {
				return res.status(404).json({ success: false, message: "User not found" });
			}

		
			req.user = user;
			next();
		} catch (error) {
			return res.status(401).json({ success: false, message: "Invalid token" });
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error while validating token",
		});
	}
};
