export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "dosen" | "mahasiswa";
  mahasiswa?: {
    nama: string;
    nim?: string;
  };
  dosen?: {
    nama: string;
    nidn?: string;
  };
}
