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
import { DosenForm } from "../../forms/DosenForm";
import { useDosen } from "../../../hooks/useDosen";
import type { Dosen } from "../../../services/dataService";

interface DosenFormData {
  nidn: string;
  nama: string;
}

export const DosenManagement: React.FC = () => {
  const { data: dosenData, loading, create, update, remove } = useDosen();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDosen, setEditingDosen] = useState<Dosen | null>(null);

  const columns: Column<Dosen>[] = [
    { key: "nidn", header: "NIDN", sortable: true },
    { key: "nama", header: "Nama", sortable: true },
  ];

  const handleAdd = () => {
    setEditingDosen(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dosen: Dosen) => {
    setEditingDosen(dosen);
    setIsModalOpen(true);
  };

  const handleDelete = async (dosen: Dosen) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${dosen.nama}?`)) {
      await remove(dosen.id_dosen, dosen.nama);
    }
  };

  const handleSubmit = async (formData: DosenFormData) => {
    const success = editingDosen
      ? await update(editingDosen.id_dosen, formData)
      : await create(formData);

    if (success) {
      setIsModalOpen(false);
      setEditingDosen(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDosen(null);
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Manajemen Dosen
        </h1>
        <p className="text-muted-foreground">Kelola data dosen pengajar</p>
      </div>

      <Card className="border-0 shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Daftar Dosen
              </CardTitle>
              <CardDescription className="mt-1">
                Total {dosenData.length} dosen terdaftar di sistem
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <DataTable
              data={dosenData}
              columns={columns}
              searchKey="nama"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              addButtonLabel="Tambah Dosen"
              isLoading={loading}
              idKey="id_dosen"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDosen ? "Edit Dosen" : "Tambah Dosen"}
        description={
          editingDosen
            ? "Update data dosen yang sudah ada"
            : "Tambahkan data dosen baru"
        }
        size="lg"
      >
        <DosenForm
          initialData={
            editingDosen
              ? {
                  nidn: editingDosen.nidn,
                  nama: editingDosen.nama,
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
