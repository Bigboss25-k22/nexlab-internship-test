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
