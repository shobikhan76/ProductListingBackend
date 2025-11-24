import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
    const { name, email, password , role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,      
            password: hashedPassword,
            role
        }); 
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        res.status(201).json({ user: newUser, token });
      
    } catch (error) {
        console.error("registration error " , error);
        res.status(500).json({ message: "Server error" });
    }   
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ user, token });
    } catch (error) {

        res.status(500).json({ message: "Server error" });
    }
};