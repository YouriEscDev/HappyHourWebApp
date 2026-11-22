'use client'
import { useActionState } from 'react'
import { login, type LoginFormState } from './action'
import { FormInput } from '@/_components/form/InputText'
import { Button } from '@/_components/Button'
import { Text } from '@/_components/Text'
import styles from './styles.module.css'
import styleForm from '@/_components/form/form.module.css'

export function LoginForm() {
    const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
        login,
        null
    )

    return (
        <form action={formAction} className={styleForm.form}>
            <FormInput
                label={'Email'}
                name={'email'}
                type={'email'}
                autoComplete={'email'}
                required
            />
            <FormInput
                label={'Password'}
                name={'password'}
                type={'password'}
                autoComplete={'current-password'}
                required
            />

            <div className={styles.forgotPwd}>
                {/* type="button" so it doesn't submit the login form. */}
                <Button type={'button'} variant={'ghost'} size={'sm'}>
                    Forgot Password ?
                </Button>
            </div>

            {state?.error && (
                <div role={'alert'} className={styles.error}>
                    <Text size={'sm'} color={'error'}>
                        {state.error}
                    </Text>
                </div>
            )}

            <div>
                <Button
                    type={'submit'}
                    variant={'primary'}
                    size={'lg'}
                    fullWidth={true}
                    loading={pending}
                >
                    Login
                </Button>
            </div>
        </form>
    )
}
