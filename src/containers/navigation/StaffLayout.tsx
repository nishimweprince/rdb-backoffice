import { ReactNode } from 'react';
import Navbar from './Navbar';
import StaffSidebar from './StaffSidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';

type StaffLayoutProps = {
  children: ReactNode;
};

const StaffLayout = ({ children }: StaffLayoutProps) => {
  // STATE VARIABLES
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  );

  return (
    <main className="relative">
      <StaffSidebar />
      <section className="max-w-[100vw]">
        <Navbar />
        <section
          className={`${
            sidebarOpen ? 'w-[80vw] left-[20vw]' : 'w-[95vw] left-[5vw]'
          } top-[10vh] absolute mx-auto flex items-center justify-center p-6`}
        >
          <section className="h-full mx-auto w-full max-w-[1500px]">
            {children}
          </section>
        </section>
      </section>
    </main>
  );
};

export default StaffLayout;
