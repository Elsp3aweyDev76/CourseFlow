'use client';

export default function CertificateActions() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex gap-2 print:hidden">
            <button
                type="button"
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
            >
                طباعة / حفظ PDF
            </button>
        </div>
    );
}