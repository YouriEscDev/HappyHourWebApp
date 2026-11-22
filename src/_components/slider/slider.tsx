'use client';

import styles from './styles.module.css';
import { Card } from '../card/Card';
import {Post} from "@/_models/posts";

interface Props {
    data: Post[];
}

export function CardSlider({ data }: Props) {
    return (
        <div className={styles.slider}>
            {data.map((item) => (
                <div className={styles.slide} key={item.id}>
                    <Card data={item}/>
                </div>
            ))}
        </div>
    );
}