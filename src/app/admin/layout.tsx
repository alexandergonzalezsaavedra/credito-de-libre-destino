import { HeroUIProvider } from '@heroui/react';
import AdminHeader from './_components/AdminHeader';

export const metadata = {
  title: 'Admin — CLD Banco Caja Social',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <div className='min-h-screen bg-gray-100 dark:bg-gray-950'>
        <AdminHeader />
        {children}
      </div>
    </HeroUIProvider>
  );
}
