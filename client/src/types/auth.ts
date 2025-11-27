export interface User {
  id_user: number;
  username: string;
  role: "admin" | "dosen" | "mahasiswa";
  nama: string;
  id_dosen?: number;
  id_mahasiswa?: number;
  nim?: string;
  nidn?: string;
  prodi?: string;
  angkatan?: number;
  email?: string;
  no_hp?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
