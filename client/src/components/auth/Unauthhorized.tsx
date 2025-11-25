export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Akses Ditolak
        </h2>
        <p className="text-gray-500 mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
};
