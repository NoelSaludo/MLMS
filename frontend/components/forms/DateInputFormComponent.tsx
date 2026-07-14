export function DateInputFormComponent({ label, value, onchange, required = false }:
    { label: string; value: string; onchange: (value: string) => void; required?: boolean }) {
    return (
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="date"
                id="date"
                value={value}
                onChange={(e) => onchange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required={required}
            />
        </div>
    )
}
