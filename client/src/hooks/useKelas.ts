import { useState, useEffect, useCallback } from "react";
import {
  type Kelas,
  kelasService,
  type MataKuliah,
  type Dosen,
} from "../services/dataService";
import { useToast } from "./useToast";

interface KelasFormData {
  id_mk: string;
  id_dosen: string;
  tahun_ajaran: string;
  semester: string;
  hari: string;
}

export const useKelas = () => {
  const [data, setData] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    mataKuliah: MataKuliah[];
    dosen: Dosen[];
    hari: string[];
  }>({ mataKuliah: [], dosen: [], hari: [] });

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await kelasService.getAll();
      setData(result);
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat data kelas";
      if (err instanceof Error) errorMessage = err.message;
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

  const fetchFormData = useCallback(async () => {
    try {
      const result = await kelasService.getFormData();
      setFormData(result);
    } catch (err) {
      console.error("Failed to fetch form data", err);
    }
  }, []);

  const create = async (formData: KelasFormData): Promise<boolean> => {
    try {
      setLoading(true);
      await kelasService.create({
        id_mk: Number(formData.id_mk),
        id_dosen: Number(formData.id_dosen),
        tahun_ajaran: formData.tahun_ajaran,
        semester: Number(formData.semester),
        hari: formData.hari,
      });
      await fetchData();
      toast({ title: "Berhasil", description: "Kelas berhasil dibuat" });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal membuat kelas";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
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
    formData: KelasFormData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await kelasService.update(id, {
        id_mk: Number(formData.id_mk),
        id_dosen: Number(formData.id_dosen),
        tahun_ajaran: formData.tahun_ajaran,
        semester: Number(formData.semester),
        hari: formData.hari,
      });
      await fetchData();
      toast({ title: "Berhasil", description: "Kelas berhasil diupdate" });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal mengupdate kelas";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
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

  const remove = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await kelasService.delete(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Kelas berhasil dihapus" });
      return true;
    } catch (err: unknown) {
      let errorMessage = "Gagal menghapus kelas";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
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
    fetchFormData();
  }, [fetchData, fetchFormData]);

  return {
    data,
    loading,
    error,
    formData,
    create,
    update,
    remove,
    refetch: fetchData,
  };
};
