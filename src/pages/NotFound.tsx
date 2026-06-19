import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '../shared/components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Halaman Tidak Ditemukan | PCC Client</title>
        <meta name="description" content="Halaman yang Anda cari tidak dapat ditemukan." />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 transition-colors duration-200">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
          <h2 className="text-2xl font-bold">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Silakan kembali ke halaman utama.
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-block">
              <Button variant="primary">
                Kembali ke Halaman Utama
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
