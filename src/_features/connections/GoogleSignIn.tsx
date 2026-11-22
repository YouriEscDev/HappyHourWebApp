"use client";
import { useEffect, useRef, useState } from "react";
import { Text } from "@/_components/Text";
import styles from "./styles.module.css";
import { googleLogin } from "@/app/login/action";


/** Give up waiting on accounts.google.com/gsi/client after this long. */
const SCRIPT_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 100;

// Inlined at build time, so this is a constant rather than effect state.
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleSignIn() {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [signInError, setSignInError] = useState<string | null>(null);

    const error = CLIENT_ID
        ? signInError
        : "Google sign-in is unavailable.";

    // Kept in a ref so a new `onCredential` identity never re-initializes GSI.
    const onCredentialRef = useRef(googleLogin);
    useEffect(() => {
        onCredentialRef.current = googleLogin;
    }, [googleLogin]);

    useEffect(() => {
        if (!CLIENT_ID) {
            console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
            return;
        }

        const renderGoogleButton = () => {
            if (!window.google || !buttonRef.current) {
                return;
            }

            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (response) => {
                    setSignInError(null);

                    void onCredentialRef.current(response.credential).then(
                        (result) => {
                            // A successful sign-in redirects, so anything
                            // returned here is a failure to surface.
                            if (result?.error) {
                                setSignInError(result.error);
                            }
                        }
                    );
                },
            });

            const containerWidth = buttonRef.current.offsetWidth;

            window.google.accounts.id.renderButton(buttonRef.current, {
                type: "standard",
                shape: "rectangular",
                theme: "outline",
                text: "continue_with",
                size: "large",
                logo_alignment: "center",
                width: Math.min(400, Math.max(200, containerWidth)),
            });
        };

        if (window.google) {
            renderGoogleButton();
            return;
        }

        // The GSI script is loaded by the root layout, so it may not be ready
        // on first paint. Poll for it, but don't poll forever.
        const startedAt = Date.now();

        const interval = setInterval(() => {
            if (window.google) {
                clearInterval(interval);
                renderGoogleButton();
                return;
            }

            if (Date.now() - startedAt > SCRIPT_TIMEOUT_MS) {
                clearInterval(interval);
                setSignInError("Google sign-in failed to load.");
            }
        }, POLL_INTERVAL_MS);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div ref={buttonRef} className={styles.container} />

            {error && (
                <div role="alert">
                    <Text size="sm" color="error" align="center">
                        {error}
                    </Text>
                </div>
            )}
        </div>
    );
}
