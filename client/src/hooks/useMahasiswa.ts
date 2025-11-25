import { useState, useEffect, useCallback } from "react";
import { type Mahasiswa, mahasiswaService } from "../services/dataService";
import { useToast } from "./useToast";

interface MahasiswaFormData {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  username?: string;
  password?: string;
}

export const useMahasiswa = () => {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mahasiswaService.getAll();
      setData(result);
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat data mahasiswa";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]); // toast adalah dependency

  const create = async (formData: MahasiswaFormData): Promise<boolean> => {
    try {
      setLoading(true);
      const newData = {
        nim: formData.nim,
        nama: formData.nama,
        prodi: formData.prodi,
        angkatan: Number(formData.angkatan),
        username: formData.username,
        password: formData.password,
      };

      await mahasiswaService.create(newData);
      await fetchData(); // Refresh data

      toast({
        title: "Berhasil",
        description: "Data mahasiswa berhasil ditambahkan",
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menambah data mahasiswa";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: number,
    formData: MahasiswaFormData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const updateData = {
        nim: formData.nim,
        nama: formData.nama,
        prodi: formData.prodi,
        angkatan: Number(formData.angkatan),
      };

      await mahasiswaService.update(id, updateData);
      await fetchData(); // Refresh data

      toast({
        title: "Berhasil",
        description: "Data mahasiswa berhasil diupdate",
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal mengupdate data mahasiswa";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number, nama: string): Promise<boolean> => {
    try {
      setLoading(true);
      await mahasiswaService.delete(id);
      await fetchData(); // Refresh data

      toast({
        title: "Berhasil",
        description: `Data ${nama} berhasil dihapus`,
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menghapus data mahasiswa";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
  };
};
