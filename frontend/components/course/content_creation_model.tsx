import MakeAnAnnouncementForm from "./make_an_announcement_form"

export default function ContentCreationModal({
    onClose, type
}: {
    onClose: () => void,
    type: 'announcement' | 'material' | 'assignment'
}) {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-semibold mb-4">Create New Course Content</h2>
                <p className="text-gray-600 mb-4">You are creating a new {type}.</p>
                {type === 'announcement' && (
                    <MakeAnAnnouncementForm />
                )}
                {type === 'material' && (
                    <p>Material form content goes here.</p>
                )}
                {type === 'assignment' && (
                    <p>Assignment form content goes here.</p>
                )}
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    )
}