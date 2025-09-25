import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token, not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};

export default protect;


// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const protect = async (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     return res.status(401).json({ success: false, message: "No token, not authorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ use verify, NOT decode
//     const user = await User.findById(decoded).select("-password");
//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Protect middleware error:", error.message);
//     return res.status(401).json({ success: false, message: "Token is invalid or expired" });
//   }
// };

// export default protect;


// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';


// const protect = async(req, res, next)=>{
//     const token = req.headers.authorization;
//     if(!token){
//         return res.json({success: false, message: "not authorized"})
//     }
//     try {
//         const userId = jwt.decode(token, process.env.JWT_SECRET)
//         if(!userId){
//             return res.json({success: false, message: "not authorized"})
//         }
//         req.user = await User.findById(userId).select("-password")
//         next();
//     } catch (error) {
//         return res.json({success: false, message: "not authorized"})
//     }
// }

// export default protect;


// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const protect = async (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not authorized, token missing" });
//     }

//     try {
//         // ✅ This verifies the token and gives you the payload
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // ✅ If your payload was just the user ID: jwt.sign(user._id, ...)
//         //    Otherwise, adjust to decoded.id or decoded.userId if it's a wrapped object
//         const user = await User.findById(decoded).select("-password");

//         if (!user) {
//             return res.status(401).json({ success: false, message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
//     }
// };

// export default protect;




