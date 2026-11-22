import styles from "@/app/home/styles.module.css";
import {Footer} from "@/_components/footer/Footer";

export default async function Layout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <div className={styles.footer}>
                <Footer selected={0}/>
            </div>
        </>)
}