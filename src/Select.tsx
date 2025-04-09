import styles from './Select.module.css'
import {ReactNode, useEffect, useRef, useState} from "react";


export type SelectOption = {
    label: string,
    value: string | number
}

type MultipleSelectProps = {
    multiple: true,
    value: SelectOption[],
    onChange: (value: SelectOption[]) => void,
}

type SingleSelectProps = {
    multiple?: false,
    value?: SelectOption,
    onChange: (value: SelectOption | undefined) => void,
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({multiple, value, onChange, options}: SelectProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function clearOptions() {
        if (multiple) {
            onChange([]);
        } else {
            onChange(undefined);
        }
    }

    function selectOption(option: SelectOption) {

        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            onChange(option);
        }
    }

    function isOptionSelected(option: SelectOption) {
        if (multiple) {
            return value.includes(option)
        } else {
            return option === value
        }
    }

    function getValue(): ReactNode {
        if (multiple) {
            return value.map(v => (
                <button key={v.value}
                        className={styles["option-badge"]}
                        onClick={e => {
                            e.stopPropagation();
                            selectOption(v);
                        }}>
                    {v.label}
                    <span className={styles["remove-btn"]}>&times;</span>
                </button>))
        } else {
            return value?.label
        }
    }

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return;
            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setIsOpen(prev => !prev);
                    if (isOpen) selectOption(options[highlightedIndex])
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    { if (!isOpen) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break }
                case 'Escape':
                    setIsOpen(false)
                    break
            }
        }
        const currentRef = containerRef.current;
        currentRef?.addEventListener('keydown', handler)

        return () => {
            currentRef?.removeEventListener('keydown', handler)
        }
    }, [isOpen, highlightedIndex, options])

    return (
        <div ref={containerRef}
             tabIndex={0} className={styles.container}
             onClick={() => setIsOpen(prev => !prev)}
             onBlur={() => setIsOpen(false)}
        >
            <span className={styles.value}>{getValue()}</span>
            <button className={styles["clear-btn"]}
                    onClick={e => {
                        e.stopPropagation();
                        clearOptions()
                    }}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li key={option.value} className={`${styles.option} 
                    ${isOptionSelected(option) ? styles.selected : ""}
                    ${index === highlightedIndex ? styles.highlighted : ""}`}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={e => {
                            e.stopPropagation();
                            selectOption(option);
                            setIsOpen(false)
                        }}
                    >{option.label}</li>
                ))}
            </ul>
        </div>
    )

}