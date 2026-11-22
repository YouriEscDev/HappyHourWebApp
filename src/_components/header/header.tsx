import styles from "./styles.module.css"
import {Text} from "@/_components/Text";
interface Props{}
export function Header({ }: Props) {
    return (
        <div className={styles.header}>
                <span className="material-symbols-outlined">
                  location_on
                </span>
            <Text size={'2xl'}>
                Montreal
            </Text>
                <span className="material-symbols-outlined">
                  stat_minus_1
                </span>
        </div>
    )
}
