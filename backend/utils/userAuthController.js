const Admin = require('../models/admin');
const Patient = require('../models/patient');
const Caregiver = require('../models/caregiver')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateOtp = require('./generateOtp');
const transporter = require('../config/nodemailerConfig');
const ActionLog = require('../models/action');  // Assuming ActionLog model is correctly defined


// Unified login function
exports.loginUser = async (req, res) => {

  const { email, password } = req.body;
  

  try {
    let user;
    let role;

    // Check if the user is an admin
    user = await Admin.findOne({ email });
    role = 'admin';


 
    if (!user) {
    //  If not admin, check if the user is a patient
      user = await Patient.findOne({ email });
      role = 'patient';

    }
    // Check if the user is a caregiver if not found as admin or patient
    if (!user) {
      user = await Caregiver.findOne({ email });
      role = 'caregiver';

    }

    if (!user) {
      // Log failed login attempt for non-existing user
      await ActionLog.create({
        userId: null,  // No valid user found, userId will be null for failed logins
        userRole: 'error',
        action: 'login',
        description: 'User not found',
        entity: 'error',
        entityId: null,
        status: 'failed',
      });
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      // Log failed login attempt for invalid password
      await ActionLog.create({
        userId: user._id,
        userRole: user.role,
        action: 'login',
        description: 'Invalid password',
        entity: user.role,
        entityId: user._id,
        status: 'failed',
      });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    const htmlContent =
      ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <h2 style="color: #4CAF50; text-align: center;">OTP Verification</h2>
            <p style="font-size: 16px; color: #333;">
                Hello, please use the following OTP to complete your login:
            </p>
            <div style="text-align: center; padding: 10px;">
                <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
            </div>
            <p style="font-size: 14px; color: #555;">
                This OTP is valid for a short time. If you didn't request this, please ignore this email or contact support.
            </p>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
                Thank you for using eMed!<br>
                The eMed Team
            </p>
        </div> `
      ;

    const info = await transporter.sendMail({
      from: 'Emed',
      to: user.email,
      subject: 'Your OTP Code',
      html: htmlContent,
    });

      // Log successful login
  await ActionLog.create({
    userId: user._id,
    userRole: user.role,
    action: 'login',
    description: 'User logged in successfully',
    entity: user.role,
    entityId: user._id,
    status: 'success',
  });

    res.status(200).json({ message: 'OTP sent to email', role });

  } catch (error) {
    console.log(error)
    
    // Log the error action in ActionLog
    await ActionLog.create({
      userId: null,  // No user context available as it's an error
      userRole: 'error',  // Role is 'error' for system-level failures
      action: 'login',
      description: 'Error logging in: ' + error.message,  // Log the error message
      entity: 'error',  // The entity will be 'error' in case of system issues
      entityId: null,  // No entity ID in case of error
      errorDetails: error.stack,  // Stack trace for debugging
      status: 'failed',
    });y
    res.status(500).json({ message: 'Error logging in', error });
  } 
};
 
// OTP Verification
exports.verifyOtp = async (req, res) => {

  const { email, otp } = req.body;

  // Check which type of user and validate OTP
  let user = await Admin.findOne({ email }) || await Patient.findOne({ email }) || await Caregiver.findOne({email});

  if (!user) {
    // Log failed OTP verification attempt for non-existing user
    await ActionLog.create({
      userId: null,  // No valid user found, userId will be null for failed logins
      userRole: 'error',
      action: 'verify_otp',
      description: 'User not found',
      entity: 'error',
      entityId: null,
      status: 'failed',
    });
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.otp || !user.otpExpiresAt) {
    // Log failed OTP verification attempt when no OTP request found
    await ActionLog.create({
      userId: user._id,  // Valid user ID
      userRole: user.role,
      action: 'verify_otp',
      description: 'No OTP request found',
      entity: user.role,  // User's role
      entityId: user._id,  // User's ID
      status: 'failed',
    });
    return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
  }


  const isOtpExpired = Date.now() > user.otpExpiresAt;
  const isOtpValid = user.otp === otp;

  if (!isOtpValid || isOtpExpired) {
    // Log failed OTP verification attempt when OTP is invalid or expired
    await ActionLog.create({
      userId: user._id,  // Valid user ID
      userRole: user.role,
      action: 'verify_otp',
      description: isOtpExpired ? 'OTP has expired' : 'Invalid OTP',
      entity: user.role,  // User's role
      entityId: user._id,  // User's ID
      status: 'failed',
    });
    return res.status(400).json({ message: isOtpExpired ? 'OTP has expired' : 'Invalid OTP' });
  }


  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.otp = undefined; // Clear OTP
  user.otpExpiresAt = undefined; // Clear expiry
  await user.save();


   // Log successful OTP verification
   await ActionLog.create({
    userId: user._id,  // Valid user ID
    userRole: user.role,
    action: 'verify_otp',
    description: 'OTP verified successfully',
    entity: user.role,  // User's role
    entityId: user._id,  // User's ID
    status: 'success',
  });

  req.user = user._id



  res.status(200).json({ message: 'OTP verified successfully', token });
};
