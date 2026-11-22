'use client'
import styles from './form.module.css'
import {useState} from "react";

export function FormInput(){
    const [query, setQuery] = useState<string>('')
    return(
        <div className={styles.inputSearch}>
                <span className="material-symbols-outlined">
                  search
                </span>
                <input type={'text'}
                       placeholder={'What are you looking for ?'}
                       value={query}
                       onChange={(e) =>setQuery(e.target.value)}/>
                {query != '' ? <span className="material-symbols-outlined" onClick={() => setQuery('')}>
                  close
                </span> : <span></span>}
        </div>
    )
}