import { api } from "./api";

export interface Mahasiswa {
  id_mahasiswa: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  id_user: number;
}

export interface Dosen {
  id_dosen: number;
  nidn: string;
  nama: string;
  id_user: number;
}

export interface MataKuliah {
  id_mk: number;
  nama_mk: string;
  sks: number;
  semester: number;
  deskripsi?: string;
}

// Mahasiswa Service
export const mahasiswaService = {
  getAll: async (): Promise<Mahasiswa[]> => {
    const response = await api.get("/mahasiswa");
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<Mahasiswa> => {
    const response = await api.get(`/mahasiswa/${id}`);
    return response.data.data || response.data;
  },

  create: async (
    data: Omit<Mahasiswa, "id_mahasiswa" | "id_user">
  ): Promise<Mahasiswa> => {
    const response = await api.post("/mahasiswa/register", data);
    return response.data.data || response.data;
  },

  update: async (id: number, data: Partial<Mahasiswa>): Promise<Mahasiswa> => {
    const response = await api.put(`/mahasiswa/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/mahasiswa/${id}`);
  },
};

// Dosen Service
export const dosenService = {
  getAll: async (): Promise<Dosen[]> => {
    const response = await api.get("/dosen");
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<Dosen> => {
    const response = await api.get(`/dosen/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: Omit<Dosen, "id_dosen" | "id_user">): Promise<Dosen> => {
    const response = await api.post("/dosen/register", data);
    return response.data.data || response.data;
  },

  update: async (id: number, data: Partial<Dosen>): Promise<Dosen> => {
    const response = await api.put(`/dosen/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/dosen/${id}`);
  },
};

// Mata Kuliah Service
export const mataKuliahService = {
  getAll: async (): Promise<MataKuliah[]> => {
    const response = await api.get("/mata-kuliah");
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<MataKuliah> => {
    const response = await api.get(`/mata-kuliah/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: Omit<MataKuliah, "id_mk">): Promise<MataKuliah> => {
    const response = await api.post("/mata-kuliah", data);
    return response.data.data || response.data;
  },

  update: async (
    id: number,
    data: Partial<MataKuliah>
  ): Promise<MataKuliah> => {
    const response = await api.put(`/mata-kuliah/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/mata-kuliah/${id}`);
  },
};

export interface Kelas {
  id_kelas: number;
  id_mk: number;
  id_dosen: number;
  tahun_ajaran: string;
  semester: number;
  hari: string;
  matakuliah: {
    nama_mk: string;
    sks: number;
    semester: number;
  };
  dosen: {
    nama: string;
    nidn: string;
  };
}

// Kelas Service
export const kelasService = {
  getAll: async (): Promise<Kelas[]> => {
    const response = await api.get("/kelas");
    return response.data.data || response.data;
  },

  getById: async (id: number): Promise<Kelas> => {
    const response = await api.get(`/kelas/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: {
    id_mk: number;
    id_dosen: number;
    tahun_ajaran: string;
    semester: number;
    hari: string;
  }): Promise<Kelas> => {
    const response = await api.post("/kelas", data);
    return response.data.data || response.data;
  },

  update: async (
    id: number,
    data: Partial<{
      id_mk: number;
      id_dosen: number;
      tahun_ajaran: string;
      semester: number;
      hari: string;
    }>
  ): Promise<Kelas> => {
    const response = await api.put(`/kelas/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/kelas/${id}`);
  },

  getFormData: async (): Promise<{
    mataKuliah: MataKuliah[];
    dosen: Dosen[];
    hari: string[];
  }> => {
    const response = await api.get("/kelas/form-data/create");
    return response.data.data || response.data;
  },
};
