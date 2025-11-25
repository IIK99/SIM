import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const dosenSchema = z.object({
  nidn: z.string().min(1, "NIDN harus diisi"),
  nama: z.string().min(1, "Nama harus diisi"),
  username: z.string().min(1, "Username harus diisi").optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
});

type DosenFormData = z.infer<typeof dosenSchema>;

interface DosenFormProps {
  initialData?: DosenFormData;
  onSubmit: (data: DosenFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DosenForm: React.FC<DosenFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<DosenFormData>({
    resolver: zodResolver(dosenSchema),
    defaultValues: initialData || {
      nidn: "",
      nama: "",
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
                Buat akun untuk login dosen ini
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
          {/* NIDN */}
          <FormField
            control={form.control}
            name="nidn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIDN *</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan NIDN" {...field} />
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
