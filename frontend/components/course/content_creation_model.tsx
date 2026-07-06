export default function ContentCreationModal({ onClose, onCreateContent }: { onClose: () => void, onCreateContent: () => void }) {

    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Create New Course Content</h2>
            {/* Form fields for creating new content */}
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                Close
            </button>
        </div>
    </div>
    )
}