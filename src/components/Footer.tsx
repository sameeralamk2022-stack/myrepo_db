export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Street Food Hub. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-white transition cursor-pointer">Vendor Support</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;