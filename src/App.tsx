import {Select, SelectOption} from "./Select.tsx";
import {useState} from "react";

const options: SelectOption[] = [
    {
        label: 'Option 1',
        value: '1'
    },
    {
        label: 'Option 2',
        value: '2'
    },
    {
        label: 'Option 3',
        value: '3'
    },
    {
        label: 'Option 4',
        value: '4'
    },
    {
        label: 'Option 5',
        value: '5'
    },
]

function App() {

    const [value1, setValue1] = useState<SelectOption | undefined>(options[0])
    const [value2, setValue2] = useState<SelectOption[]>([options[0]])

    return (
        <>
            <Select onChange={v => setValue1(v)} options={options} value={value1}/>
            <Select multiple onChange={v => setValue2(v)} options={options} value={value2}/>
        </>
    )
}

export default App
