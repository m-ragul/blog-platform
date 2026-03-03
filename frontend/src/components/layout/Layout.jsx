import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-midnight relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-violet blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-electric-blue blur-[120px] rounded-full"></div>
      </div>

      <Navbar />
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default Layout;