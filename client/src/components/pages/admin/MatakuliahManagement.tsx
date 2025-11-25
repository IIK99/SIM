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
import {
  MataKuliahForm,
  type MataKuliahFormData,
} from "../../forms/MatakuliahForm";
import { useMataKuliah } from "../../../hooks/useMataKuliah";
import type { MataKuliah } from "../../../services/dataService";

export const MataKuliahManagement: React.FC = () => {
  const { data: matkulData, loading, create, update, remove } = useMataKuliah();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatkul, setEditingMatkul] = useState<MataKuliah | null>(null);

  const columns: Column<MataKuliah>[] = [
    { key: "nama_mk", header: "Nama Mata Kuliah", sortable: true },
    { key: "sks", header: "SKS", sortable: true },
    { key: "semester", header: "Semester", sortable: true },
  ];

  const handleAdd = () => {
    setEditingMatkul(null);
    setIsModalOpen(true);
  };

  const handleEdit = (matkul: MataKuliah) => {
    setEditingMatkul(matkul);
    setIsModalOpen(true);
  };

  const handleDelete = async (matkul: MataKuliah) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${matkul.nama_mk}?`)) {
      await remove(matkul.id_mk, matkul.nama_mk);
    }
  };

  const handleSubmit = async (formData: MataKuliahFormData) => {
    const payload = {
      ...formData,
      sks: Number(formData.sks),
      semester: Number(formData.semester),
    };

    const success = editingMatkul
      ? await update(editingMatkul.id_mk, payload)
      : await create(payload);

    if (success) {
      setIsModalOpen(false);
      setEditingMatkul(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatkul(null);
  };

  return (
    <div className="space-y-6 h-full p-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Mata Kuliah</h1>
        <p className="text-gray-600">Kelola data mata kuliah universitas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mata Kuliah</CardTitle>
          <CardDescription>
            Total {matkulData.length} mata kuliah terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={matkulData}
            columns={columns}
            searchKey="nama_mk"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            addButtonLabel="Tambah Mata Kuliah"
            isLoading={loading}
            idKey="id_mk"
          />
        </CardContent>
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMatkul ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
        description={
          editingMatkul
            ? "Update data mata kuliah yang sudah ada"
            : "Tambahkan data mata kuliah baru"
        }
        size="lg"
      >
        <MataKuliahForm
          initialData={
            editingMatkul
              ? {
                  nama_mk: editingMatkul.nama_mk,
                  sks: String(editingMatkul.sks),
                  semester: String(editingMatkul.semester),
                  deskripsi: editingMatkul.deskripsi || "",
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
