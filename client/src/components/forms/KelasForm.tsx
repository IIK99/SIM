import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { MataKuliah, Dosen } from "../../services/dataService";

const kelasSchema = z.object({
  id_mk: z.string().min(1, "Mata Kuliah harus dipilih"),
  id_dosen: z.string().min(1, "Dosen harus dipilih"),
  tahun_ajaran: z.string().regex(/^\d{4}\/\d{4}$/, "Format harus YYYY/YYYY"),
  semester: z.string().min(1, "Semester harus diisi"),
  hari: z.string().min(1, "Hari harus dipilih"),
});

export type KelasFormData = z.infer<typeof kelasSchema>;

interface KelasFormProps {
  initialData?: KelasFormData;
  onSubmit: (data: KelasFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mataKuliahOptions: MataKuliah[];
  dosenOptions: Dosen[];
  hariOptions: string[];
}

export const KelasForm: React.FC<KelasFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mataKuliahOptions,
  dosenOptions,
  hariOptions,
}) => {
  const form = useForm<KelasFormData>({
    resolver: zodResolver(kelasSchema),
    defaultValues: initialData || {
      id_mk: "",
      id_dosen: "",
      tahun_ajaran: `${new Date().getFullYear()}/${
        new Date().getFullYear() + 1
      }`,
      semester: "",
      hari: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mata Kuliah */}
          <FormField
            control={form.control}
            name="id_mk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mata Kuliah *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Mata Kuliah" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mataKuliahOptions.map((mk) => (
                      <SelectItem key={mk.id_mk} value={String(mk.id_mk)}>
                        {mk.nama_mk} (SKS: {mk.sks}, Sem: {mk.semester})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dosen */}
          <FormField
            control={form.control}
            name="id_dosen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosen Pengampu *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Dosen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dosenOptions.map((d) => (
                      <SelectItem key={d.id_dosen} value={String(d.id_dosen)}>
                        {d.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tahun Ajaran */}
          <FormField
            control={form.control}
            name="tahun_ajaran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun Ajaran *</FormLabel>
                <FormControl>
                  <Input placeholder="2024/2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Semester */}
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hari */}
          <FormField
            control={form.control}
            name="hari"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hari *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Hari" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hariOptions.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : initialData ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
