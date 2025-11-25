import { useState, useEffect, useCallback } from "react";
import { type MataKuliah, mataKuliahService } from "../services/dataService";
import { useToast } from "./useToast";

interface MataKuliahFormData {
  nama_mk: string;
  sks: number;
  semester: number;
  deskripsi?: string;
}

export const useMataKuliah = () => {
  const [data, setData] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mataKuliahService.getAll();
      setData(result);
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat data mata kuliah";

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
  }, [toast]);

  const create = async (formData: MataKuliahFormData): Promise<boolean> => {
    try {
      setLoading(true);

      await mataKuliahService.create(formData);
      await fetchData(); // Refresh data

      toast({
        title: "Berhasil",
        description: "Data mata kuliah berhasil ditambahkan",
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menambah data mata kuliah";

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
    formData: MataKuliahFormData
  ): Promise<boolean> => {
    try {
      setLoading(true);

      await mataKuliahService.update(id, formData);
      await fetchData(); // Refresh data

      toast({
        title: "Berhasil",
        description: "Data mata kuliah berhasil diupdate",
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal mengupdate data mata kuliah";

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
      await mataKuliahService.delete(id);
      await fetchData(); // Refresh data

      toast({
        title: "Berhasil",
        description: `Data ${nama} berhasil dihapus`,
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menghapus data mata kuliah";

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
