export function TextInputFormComponent({ label, value, onchange, required = false }:
    { label: string; value: string; onchange: (value: string) => void; required?: boolean }) {
    return (
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                id="title"
                value={value}
                onChange={(e) => onchange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
            />
        </div>
    )
}

export function TextAreaFormComponent({ label, value, onchange, required = false }:
    { label: string; value: string; onchange: (value: string) => void; required?: boolean }) {
    return (
        <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
                id="content"
                value={value}
                onChange={(e) => onchange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required={required}
            />
        </div>
    )
}