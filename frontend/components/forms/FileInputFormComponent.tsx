export default function FileInputFormComponent({ label, onchange, required = false }:
    { label: string; onchange: (file: File | null) => void; required?: boolean }) {
    return (
        <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="file"
                id="file"
                onChange={(e) => onchange(e.target.files ? e.target.files[0] : null)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required={required}
            />
        </div>
    )
}