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
import { Textarea } from "../ui/textarea";

const mataKuliahSchema = z.object({
  nama_mk: z.string().min(1, "Nama mata kuliah harus diisi"),
  sks: z.string().min(1, "SKS harus diisi"),
  semester: z.string().min(1, "Semester harus diisi"),
  deskripsi: z.string().optional(),
});

// Helper type for form input (before transformation)
type MataKuliahFormInput = {
  nama_mk: string;
  sks: string;
  semester: string;
  deskripsi?: string;
};

// Type for the output data after validation/transformation
export type MataKuliahFormData = z.infer<typeof mataKuliahSchema>;

interface MataKuliahFormProps {
  initialData?: MataKuliahFormInput;
  onSubmit: (data: MataKuliahFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MataKuliahForm: React.FC<MataKuliahFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<MataKuliahFormInput>({
    resolver: zodResolver(mataKuliahSchema),
    defaultValues: initialData || {
      nama_mk: "",
      sks: "",
      semester: "",
      deskripsi: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama MK */}
        <FormField
          control={form.control}
          name="nama_mk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Mata Kuliah *</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama mata kuliah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SKS */}
          <FormField
            control={form.control}
            name="sks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKS *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="6" {...field} />
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
        </div>

        {/* Deskripsi */}
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi mata kuliah (opsional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
