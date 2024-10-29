import { useEffect, useRef, useState } from "react";

export default function IntroModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modalDismissed = localStorage.getItem("modalDismissed");

    if (!modalDismissed) {
      setIsOpen(true);
    }
  }, []);

  // Function to handle dismissing the modal
  const handleDismiss = () => {
    localStorage.setItem("modalDismissed", "true");
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (modalRef.current) {
      modalRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className="intro-modal mx-auto w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Welcome to <span className="font-bold text-primary-blue">cshome!</span>
      </h2>
      <div className="mb-6 text-gray-600">
        <p>
          After 4 years of using UWA's csmarks I decided to see what I could
          come up with.
        </p>
        <p>This is just a proof of concept, no data is real.</p>
      </div>

      <button
        onClick={handleDismiss}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Got it!
      </button>
    </dialog>
  );
}
