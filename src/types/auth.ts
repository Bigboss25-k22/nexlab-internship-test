// DTOs (Request)
export interface RegisterDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'owner' | 'freelancer';
  // Optional user profile fields
  birthDate?: string;
  gender?: string;
  avatar?: string;
  // Optional fields for freelancer
  houseNumber?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
}

export interface LoginDto {
  emailOrPhone: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// Email Verification DTOs
export interface SendVerificationEmailDto {
  email: string;
}

export interface VerifyEmailDto {
  email: string;
  verificationCode: string;
}

export interface ResendVerificationDto {
  email: string;
}

// Password Reset DTOs
export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  resetToken: string;
  resetCode: string;
  newPassword: string;
}

export interface VerifyResetCodeDto {
  resetToken: string;
  resetCode: string;
}

// Responses
export interface RegisterResponse {
  fullName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// Secure login response (không trả refresh token trong JSON)
export interface SecureLoginResponse {
  accessToken: string;
}

export type AuthResponse = LoginResponse;

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

// JWT Payloads
export interface JwtPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}
