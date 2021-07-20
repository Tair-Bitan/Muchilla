import { ChangeEvent, useEffect, useState } from "react";

export function useDebounce(val: string | number, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(val);

    useEffect(() => {
        const handler = setTimeout(() => {
            // console.log('changing');
            setDebouncedValue(val)
        }, delay)

        return () => {
            // console.log('clearing');
            clearTimeout(handler)
        }
    }, [val])

    return debouncedValue
}

export function useForm(initialState: any, cb = (args?: any) => { }) {
    const [fields, setFields] = useState(initialState)

    useEffect(() => {
        cb(fields)
    }, [fields])

    return [
        fields,
        function (ev: ChangeEvent<HTMLInputElement>) {
            const field = ev.target.name
            const value = (ev.target.type === 'number') ? +ev.target.value : ev.target.value
            setFields((prevFields: any) => ({ ...prevFields, [field]: value }))
        },
        setFields /* for using setFields outside the hook. 
        example: if we want to use the hook in edit page and need
         to load the initialState asynchronicly */
    ]
}