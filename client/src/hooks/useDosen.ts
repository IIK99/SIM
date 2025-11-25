import { useState, useEffect, useCallback } from "react";
import { type Dosen, dosenService } from "../services/dataService";
import { useToast } from "./useToast";

interface DosenFormData {
  nidn: string;
  nama: string;
  username?: string;
  password?: string;
}

export const useDosen = () => {
  const [data, setData] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dosenService.getAll();
      setData(result);
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat data dosen";

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

  const create = async (formData: DosenFormData): Promise<boolean> => {
    try {
      setLoading(true);
      const newData = {
        nidn: formData.nidn,
        nama: formData.nama,
        username: formData.username,
        password: formData.password,
      };

      await dosenService.create(newData);
      await fetchData();

      toast({
        title: "Berhasil",
        description: "Data dosen berhasil ditambahkan",
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menambah data dosen";

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
    formData: DosenFormData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const updateData = {
        nidn: formData.nidn,
        nama: formData.nama,
      };

      await dosenService.update(id, updateData);
      await fetchData();

      toast({
        title: "Berhasil",
        description: "Data dosen berhasil diupdate",
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal mengupdate data dosen";

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
      await dosenService.delete(id);
      await fetchData();

      toast({
        title: "Berhasil",
        description: `Data ${nama} berhasil dihapus`,
      });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menghapus data dosen";

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
