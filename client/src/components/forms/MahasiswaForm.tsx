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

const mahasiswaSchema = z.object({
  nim: z.string().min(1, "NIM harus diisi"),
  nama: z.string().min(1, "Nama harus diisi"),
  prodi: z.string().min(1, "Program studi harus dipilih"),
  angkatan: z.string().min(4, "Angkatan harus diisi"),
  username: z.string().min(1, "Username harus diisi").optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
});

type MahasiswaFormData = z.infer<typeof mahasiswaSchema>;

interface MahasiswaFormProps {
  initialData?: MahasiswaFormData;
  onSubmit: (data: MahasiswaFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const prodiOptions = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Teknik Komputer",
  "Manajemen Informatika",
  "Teknologi Informasi",
];

const angkatanOptions = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

export const MahasiswaForm: React.FC<MahasiswaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<MahasiswaFormData>({
    resolver: zodResolver(mahasiswaSchema),
    defaultValues: initialData || {
      nim: "",
      nama: "",
      prodi: "",
      angkatan: "",
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!initialData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="col-span-2 mb-2">
              <h3 className="font-medium text-gray-900">Akun Pengguna</h3>
              <p className="text-sm text-gray-500">
                Buat akun untuk login mahasiswa ini
              </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="Username login" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password login"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NIM */}
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIM *</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan NIM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nama */}
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap *</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Program Studi */}
          <FormField
            control={form.control}
            name="prodi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Studi *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program studi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prodiOptions.map((prodi) => (
                      <SelectItem key={prodi} value={prodi}>
                        {prodi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Angkatan */}
          <FormField
            control={form.control}
            name="angkatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Angkatan *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih angkatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {angkatanOptions.map((tahun) => (
                      <SelectItem key={tahun} value={tahun}>
                        {tahun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
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
