"use client";
import styles from './appShell.module.css'
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isPhone, setIsPhone] = useState<boolean | null>(null);

    useEffect(() => {
        const checkDevice = () => {
            /*const isMobileDevice =
                /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);*/

            const isMobileDevice =
                /Android|iPhone|iPod|Windows Phone/i.test(navigator.userAgent) ||
                (navigator.maxTouchPoints > 0 && window.innerWidth < 600);
            setIsPhone(isMobileDevice);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);

        return () => {
            window.removeEventListener("resize", checkDevice);
        };
    }, []);

    if (isPhone === null) {
        return null;
    }

    return (
            <main className={`${styles.appShell} ${isPhone ? styles.phone : styles.desktop}`}>
                <div className={styles.app}>
                    {children}
                </div>
            </main>
    );
}