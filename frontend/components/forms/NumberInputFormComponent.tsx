export function NumberInputFormComponent({ label, value, onchange, required = false }:
    { label: string; value: number | null; onchange: (value: number | null) => void; required?: boolean }) {
    return (
        <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="number"
                id="number"
                value={value ?? ''}
                onChange={(e) => onchange(e.target.value ? parseFloat(e.target.value) : null)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required={required}
            />
        </div>
    )
}
