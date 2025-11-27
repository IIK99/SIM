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
import { KelasForm, type KelasFormData } from "../../forms/KelasForm";
import { useKelas } from "../../../hooks/useKelas";
import type { Kelas } from "../../../services/dataService";

export const KelasManagement: React.FC = () => {
  const { data, loading, formData, create, update, remove } = useKelas();
  console.log("Kelas Data:", data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);

  const columns: Column<Kelas>[] = [
    {
      key: "matakuliah.nama_mk",
      header: "Mata Kuliah",
      sortable: true,
    },
    {
      key: "dosen.nama",
      header: "Dosen Pengampu",
      sortable: true,
    },
    { key: "tahun_ajaran", header: "Tahun Ajaran", sortable: true },
    { key: "semester", header: "Semester", sortable: true },
    { key: "hari", header: "Hari", sortable: true },
  ];

  const handleAdd = () => {
    setEditingKelas(null);
    setIsModalOpen(true);
  };

  const handleEdit = (kelas: Kelas) => {
    setEditingKelas(kelas);
    setIsModalOpen(true);
  };

  const handleDelete = async (kelas: Kelas) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus kelas ${kelas.matakuliah.nama_mk}?`
      )
    ) {
      await remove(kelas.id_kelas);
    }
  };

  const handleSubmit = async (data: KelasFormData) => {
    const success = editingKelas
      ? await update(editingKelas.id_kelas, data)
      : await create(data);

    if (success) {
      setIsModalOpen(false);
      setEditingKelas(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKelas(null);
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Manajemen Kelas
        </h1>
        <p className="text-muted-foreground">
          Kelola jadwal dan pembagian kelas
        </p>
      </div>

      <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Daftar Kelas
              </CardTitle>
              <CardDescription className="mt-1">
                Total {data.length} kelas terdaftar di sistem
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <DataTable
              data={data}
              columns={columns}
              searchKey="matakuliah.nama_mk"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              addButtonLabel="Tambah Kelas"
              isLoading={loading}
              idKey="id_kelas"
            />
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingKelas ? "Edit Kelas" : "Tambah Kelas"}
        description={editingKelas ? "Update data kelas" : "Buat kelas baru"}
        size="lg"
      >
        <KelasForm
          initialData={
            editingKelas
              ? {
                  id_mk: String(editingKelas.id_mk),
                  id_dosen: String(editingKelas.id_dosen),
                  tahun_ajaran: editingKelas.tahun_ajaran,
                  semester: String(editingKelas.semester),
                  hari: editingKelas.hari,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={loading}
          mataKuliahOptions={formData.mataKuliah}
          dosenOptions={formData.dosen}
          hariOptions={formData.hari}
        />
      </Modal>
    </div>
  );
};
