// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { name, email, password, role, rollNumber, department, interestedStyle,
            styleSpecialization, bio, socialLinks } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and password' 
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user (include teacher fields when present)
        const createPayload = {
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            rollNumber,
            department,
            interestedStyle
        };

        if (role === 'teacher' || (role === undefined && req.body.styleSpecialization)) {
            // include teacher-specific fields when registering a teacher
            createPayload.styleSpecialization = styleSpecialization;
            createPayload.bio = bio;
            if (socialLinks) createPayload.socialLinks = socialLinks;
        }

        const user = await User.create(createPayload);
        
        console.log('User created successfully:', user.email);

        // If the new user is a student, try to assign a teacher matching their interestedStyle
        if ((role || 'student') === 'student' && interestedStyle) {
            try {
            // Normalize style and search case-insensitively for matching teacher specializations
            const style = String(interestedStyle).trim();

            // Escape regex special chars in style
            const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const teachers = await User.find({ role: 'teacher', styleSpecialization: { $regex: `^${escapeRegex(style)}$`, $options: 'i' } });

            console.log('Matching teachers found:', teachers.map(t => ({ email: t.email, spec: t.styleSpecialization })));

                if (teachers && teachers.length > 0) {
                    // Compute assigned student counts for each teacher and pick the teacher with the fewest students
                    const counts = await Promise.all(teachers.map(async (t) => {
                        const cnt = await User.countDocuments({ assignedTeacher: t._id });
                        console.log(`• Teacher ${t.email} has ${cnt} assigned students`);
                        return { teacher: t, count: cnt };
                    }));

                    counts.sort((a, b) => a.count - b.count);
                    const chosen = counts[0].teacher;

                    // Update student with assignedTeacher
                    user.assignedTeacher = chosen._id;
                    await user.save();

                    console.log(`Assigned teacher ${chosen.email} to student ${user.email}`);
                } else {
                    console.log(' No matching teacher found for style:', interestedStyle);
                    // Fallback: if there are any teachers at all, assign the student to the teacher with fewest students
                    const anyTeachers = await User.find({ role: 'teacher' });
                    if (anyTeachers && anyTeachers.length > 0) {
                        const anyCounts = await Promise.all(anyTeachers.map(async (t) => {
                            const cnt = await User.countDocuments({ assignedTeacher: t._id });
                            return { teacher: t, count: cnt };
                        }));
                        anyCounts.sort((a, b) => a.count - b.count);
                        const fallback = anyCounts[0].teacher;
                        user.assignedTeacher = fallback._id;
                        await user.save();
                        console.log(`Fallback assigned teacher ${fallback.email} to student ${user.email}`);
                    } else {
                        console.log('ℹNo teachers available to assign');
                    }
                }
            } catch (assignErr) {
                console.error('Error assigning teacher:', assignErr);
            }
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error(' Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error. Please try again later.',
            error: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log(email, password);
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }
        
        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};
