'use client';
import styles from "./styles.module.css";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Text } from "@/_components/Text";
import {useState} from "react";

interface Props {
    selected: number;
}

const NAV_ITEMS = [
    { route: '/home', icon: 'home', label: 'Home' },
    { route: '/home/search', icon: 'loupe', label: 'Explore' },
    { route: '/home/map', icon: 'map', label: 'Map' },
    { route: '/home/xx', icon: 'heart', label: 'Favorites' },
    { route: '/home/yy', icon: 'profile', label: 'Profile' },
];

export function Footer({ }: Props) {
    const [selected, setIndex] = useState<number>(0)
    const router = useRouter();

    return (
        <div className={styles.footer}>
            {NAV_ITEMS.map((item, i) => {
                const isSelected = i === selected;
                return (
                    <button
                        key={item.route}
                        type="button"
                        className={isSelected ? styles.selected : ''}
                        onClick={() => {
                            setIndex(i)
                            router.push(item.route)
                        }}
                        aria-current={isSelected ? 'page' : undefined}
                    >
                        <Image
                            src={`/img/logo/footer/${item.icon}${isSelected ? 'Red' : 'Black'}.png`}
                            alt={`${item.label} icon`}
                            width={30}
                            height={30}
                        />
                        <div>
                            <Text>{item.label}</Text>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}