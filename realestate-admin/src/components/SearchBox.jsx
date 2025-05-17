import React, { useState } from 'react'
import { cn } from '../utils';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ className, value: initialValue = '', placeholder, onChange, containerClassName = '' }) => {
    const [value, setValue] = useState(initialValue ?? '');

    const handleOnChange = (e) => {
        const term = e.target.value;
        setValue(term);
        onChange(term)    
    }

    return (
        <div className={cn("relative flex items-center", containerClassName)}>         
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleOnChange}
                className={cn("!pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", className)}
            />
            <FaSearch className="h-4 w-4 text-gray-400 absolute left-2.5 self-center" />
        </div>
    )
}

export default SearchBox