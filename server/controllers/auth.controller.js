import User from "../model/user.model.js";

const sendTokenAsCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({ name, email, password });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = user.generateAuthToken();
  sendTokenAsCookie(res, token);

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getAuthenticatedUser = async (req, res) => { 
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password -jwtTokens");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res
    .status(200)
    .json({ user: { name: user.name, email: user.email, role: user.role } });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
