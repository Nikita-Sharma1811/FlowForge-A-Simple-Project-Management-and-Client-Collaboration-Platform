import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 max-h-screen z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex">
            <h3 className="text-lg font-semibold text-gray-900"></h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className=" rounded hover:bg-gray-100"
            >
              <svg className=" absolute w-8 h-8 right-5 top-5 " viewBox="0 0 24 24" fill="none" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-0">{children}</div>
        </div>
      </div>
    </div>
  );
}


