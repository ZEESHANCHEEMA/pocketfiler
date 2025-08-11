import AuthService from './authService';
import { ErrorToast, SuccessToast } from '../Components/toast/Toast';

class LoginService {
  // Regular email/password login
  static async loginWithCredentials(email, password) {
    try {
      const credentials = {
        email,
        password,
        deviceToken: localStorage.getItem("fcm_token") || null,
      };

      const result = await AuthService.login(credentials);
      
      if (result.success) {
        // Store user data
        AuthService.setToken(result.data.token);
        AuthService.setUser(result.data.data);
        
        // Store additional data for backward compatibility
        localStorage.setItem("_id", result.data.data?.id);
        localStorage.setItem("profileupdate", result.data.data?.profileUpdate);
        localStorage.setItem("role", result.data.data?.role);
        localStorage.setItem("name", result.data.data?.fullname);
        
        SuccessToast("Signed In Successfully");
        
        return {
          success: true,
          data: result.data,
          redirectTo: result.data.data?.profileUpdate ? "/Dashboard" : "/Profile"
        };
      } else {
        // Handle specific error cases
        if (result.message === "Email not verified. Verification code sent to your email.") {
          return {
            success: false,
            message: result.message,
            redirectTo: `/SignUp-Verify/${email}`,
            requiresVerification: true
          };
        }
        
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      ErrorToast('An error occurred during login. Please try again.');
      return {
        success: false,
        message: 'An error occurred during login. Please try again.'
      };
    }
  }

  // Google login
  static async loginWithGoogle(googleData) {
    try {
      const userData = {
        email: googleData.email,
        fullname: googleData.name,
        isGoogleSignIn: true,
        islinkedinSignIn: false,
      };

      const result = await AuthService.googleSignup(userData);
      
      if (result.success) {
        // Store user data
        AuthService.setToken(result.data.token);
        AuthService.setUser(result.data.data);
        
        // Store additional data for backward compatibility
        localStorage.setItem("_id", result.data.data?.id);
        localStorage.setItem("profileupdate", result.data.data?.profileUpdate);
        localStorage.setItem("role", result.data.data?.role);
        localStorage.setItem("name", result.data.data?.fullname);
        
        SuccessToast("Google Login Success");
        
        return {
          success: true,
          data: result.data,
          redirectTo: result.data.data?.profileUpdate ? "/Dashboard" : "/Profile"
        };
      } else {
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Google login error:', error);
      ErrorToast('An error occurred during Google login. Please try again.');
      return {
        success: false,
        message: 'An error occurred during Google login. Please try again.'
      };
    }
  }

  // LinkedIn login
  static async loginWithLinkedIn(linkedinCode) {
    try {
      const linkedinData = {
        code: linkedinCode,
      };

      const result = await AuthService.linkedinLogin(linkedinData);
      
      if (result.success) {
        // Store user data
        AuthService.setToken(result.data.token);
        AuthService.setUser(result.data.data);
        
        // Store additional data for backward compatibility
        localStorage.setItem("_id", result.data.data?.id);
        localStorage.setItem("profileupdate", result.data.data?.profileUpdate);
        localStorage.setItem("role", result.data.data?.role);
        localStorage.setItem("name", result.data.data?.fullname);
        
        SuccessToast("LinkedIn Login Success");
        
        return {
          success: true,
          data: result.data,
          redirectTo: result.data.data?.profileUpdate ? "/Dashboard" : "/Profile"
        };
      } else {
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('LinkedIn login error:', error);
      ErrorToast('An error occurred during LinkedIn login. Please try again.');
      return {
        success: false,
        message: 'An error occurred during LinkedIn login. Please try again.'
      };
    }
  }

  // Forgot password
  static async forgotPassword(email) {
    try {
      const result = await AuthService.forgotPassword(email);
      
      if (result.success) {
        SuccessToast("Password reset email sent successfully");
        return {
          success: true,
          message: "Password reset email sent successfully"
        };
      } else {
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      ErrorToast('An error occurred. Please try again.');
      return {
        success: false,
        message: 'An error occurred. Please try again.'
      };
    }
  }

  // Reset password
  static async resetPassword(resetData) {
    try {
      const result = await AuthService.resetPassword(resetData);
      
      if (result.success) {
        SuccessToast("Password reset successfully");
        return {
          success: true,
          message: "Password reset successfully"
        };
      } else {
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      ErrorToast('An error occurred. Please try again.');
      return {
        success: false,
        message: 'An error occurred. Please try again.'
      };
    }
  }

  // Verify email code
  static async verifyEmailCode(verificationData) {
    try {
      const result = await AuthService.verifyCode(verificationData);
      
      if (result.success) {
        SuccessToast("Email verified successfully");
        return {
          success: true,
          data: result.data
        };
      } else {
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      ErrorToast('An error occurred during verification. Please try again.');
      return {
        success: false,
        message: 'An error occurred during verification. Please try again.'
      };
    }
  }

  // Update verification code
  static async updateVerificationCode(email) {
    try {
      const result = await AuthService.updateVerificationCode(email);
      
      if (result.success) {
        SuccessToast("Verification code sent successfully");
        return {
          success: true,
          message: "Verification code sent successfully"
        };
      } else {
        ErrorToast(result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Update verification code error:', error);
      ErrorToast('An error occurred. Please try again.');
      return {
        success: false,
        message: 'An error occurred. Please try again.'
      };
    }
  }

  // Logout
  static logout() {
    try {
      AuthService.clearAuth();
      SuccessToast("Logged out successfully");
      return {
        success: true,
        message: "Logged out successfully"
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'An error occurred during logout.'
      };
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return AuthService.isAuthenticated();
  }

  // Get current user
  static getCurrentUser() {
    return AuthService.getUser();
  }

  // Get current token
  static getCurrentToken() {
    return AuthService.getToken();
  }
}

export default LoginService; 