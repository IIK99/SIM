import { useState } from "react";
import { DataTable, type Column } from "../../ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Modal } from "../../ui/modal";
import { MahasiswaForm } from "../../forms/MahasiswaForm";
import { useMahasiswa } from "../../../hooks/useMahasiswa";
import type { Mahasiswa } from "../../../services/dataService"; // Type-only import

// Buat interface untuk form data
interface MahasiswaFormData {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  email?: string;
  no_hp?: string;
  alamat?: string;
}

export const MahasiswaManagement: React.FC = () => {
  const {
    data: mahasiswaData,
    loading,
    create,
    update,
    remove,
  } = useMahasiswa();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState<Mahasiswa | null>(
    null
  );

  const columns: Column<Mahasiswa>[] = [
    { key: "nim", header: "NIM", sortable: true },
    { key: "nama", header: "Nama", sortable: true },
    { key: "prodi", header: "Program Studi", sortable: true },
    { key: "angkatan", header: "Angkatan", sortable: true },
  ];

  const handleAdd = () => {
    setEditingMahasiswa(null);
    setIsModalOpen(true);
  };

  const handleEdit = (mahasiswa: Mahasiswa) => {
    setEditingMahasiswa(mahasiswa);
    setIsModalOpen(true);
  };

  const handleDelete = async (mahasiswa: Mahasiswa) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${mahasiswa.nama}?`)) {
      await remove(mahasiswa.id_mahasiswa, mahasiswa.nama);
    }
  };

  const handleSubmit = async (formData: MahasiswaFormData) => {
    // Ganti any dengan MahasiswaFormData
    const success = editingMahasiswa
      ? await update(editingMahasiswa.id_mahasiswa, formData)
      : await create(formData);

    if (success) {
      setIsModalOpen(false);
      setEditingMahasiswa(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMahasiswa(null);
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Manajemen Mahasiswa
        </h1>
        <p className="text-muted-foreground">
          Kelola data mahasiswa universitas
        </p>
      </div>

      <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Daftar Mahasiswa
              </CardTitle>
              <CardDescription className="mt-1">
                Total {mahasiswaData.length} mahasiswa terdaftar di sistem
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <DataTable
              data={mahasiswaData}
              columns={columns}
              searchKey="nama"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              addButtonLabel="Tambah Mahasiswa"
              isLoading={loading}
              idKey="id_mahasiswa"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
        description={
          editingMahasiswa
            ? "Update data mahasiswa yang sudah ada"
            : "Tambahkan data mahasiswa baru"
        }
        size="lg"
      >
        <MahasiswaForm
          initialData={
            editingMahasiswa
              ? {
                  nim: editingMahasiswa.nim,
                  nama: editingMahasiswa.nama,
                  prodi: editingMahasiswa.prodi,
                  angkatan: editingMahasiswa.angkatan.toString(),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};
