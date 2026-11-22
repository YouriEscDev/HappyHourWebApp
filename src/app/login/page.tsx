import styles from "./styles.module.css"
import {Text} from "@/_components/Text";
import GoogleSignIn from "@/_features/connections/GoogleSignIn";
import {LoginForm} from "./LoginForm";

export default function Login() {
    return (
        <>
            <Text size={'4xl'} as={'h1'} weight={'bold'} align={'center'}>Welcome</Text>
            <Text size={'xl'} weight={'medium'} align={'center'}>Discover what&apos;s happening around.</Text>
            <LoginForm/>
            <div className={styles.separator}>
                <div>OR</div>
            </div>
            <div className={styles.googleLogin}>
                <GoogleSignIn/>
            </div>
        </>
    )
}
