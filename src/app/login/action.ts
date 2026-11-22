'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {getApiUrl, readApiError} from "@/_utils/callApi";

/**
 * Server-side client for the Rust/Axum auth API (`nest("/auth", auth_routes())`).
 *
 * These run on the Next server, never in the browser, which means:
 *   - the API never sees a cross-origin request, so no CORS layer is needed in Axum
 *   - the JWT lands in an httpOnly cookie and is unreachable from page scripts
 */

const SESSION_COOKIE = 'session'

/** Matches the 24h expiry in `create_token()` (api/src/services/jwt_service.rs). */
const SESSION_MAX_AGE = 60 * 60 * 24

/** Mirrors `PublicUser` in api/src/models/user_model.rs. */
type PublicUser = {
    id: string
    email: string
    given_name: string
}

/** Mirrors `AuthResponse` in api/src/models/user_model.rs. */
type AuthResponse = {
    token: string
    user: PublicUser
}

/**
 * Every API failure now shares one shape, set by `impl IntoResponse for
 * ApiError` in api/src/error.rs: `{"error": "..."}` with an
 * `application/json` content type. `ApiJson` applies it to malformed-body
 * rejections too, so there is no plain-text path left.
 */
type ApiError = { error: string }

export type LoginFormState = ApiError | null

async function auth(
    path: string,
    body: unknown
): Promise<AuthResponse | ApiError> {
    let response: Response
    try {
        response = await fetch(`${getApiUrl()}/auth${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
        })
    } catch (cause) {
        console.error(`POST /auth${path} could not reach the API:`, cause)
        return { error: 'Unable to reach the server. Please try again.' }
    }
    if (!response.ok) {
        return { error: await readApiError(response) }
    }
    return (await response.json()) as AuthResponse
}

async function startSession({ token }: AuthResponse): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
    })
}

/**
 * POST /auth/login — bound to the login `<form>` through `useActionState`.
 * Returns an error to render, or redirects on success.
 */
export async function login(
    _previousState: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
        return { error: 'Email and password are required.' }
    }

    const result = await auth('/login', { email, password })

    if ('error' in result) {
        return result
    }

    await startSession(result)

    // `redirect` throws, so it must stay outside any try/catch.
    redirect('/home')
}

/**
 * POST /auth/register — no UI wired to this yet.
 * Body matches `RegisterPayload` in api/src/models/user_model.rs.
 */
export async function register(input: {
    email: string
    password: string
    given_name: string
}): Promise<ApiError | void> {
    const email = input.email.trim()
    const given_name = input.given_name.trim()

    if (!email || !given_name) {
        return { error: 'Email and givenName are required.' }
    }

    // Matches the server-side check in `register`.
    if (input.password.length < 8) {
        return { error: 'Password must be at least 8 characters.' }
    }

    const result = await auth('/register', {
        email,
        password: input.password,
        given_name,
    })

    if ('error' in result) {
        return result
    }
    await startSession(result)
    redirect('/home')
}

/**
 * POST /auth/google — takes the `credential` from Google Identity Services and
 * sends it as `id_token`, matching `GoogleAuthPayload`.
 *
 * `givenName` is optional and only used when Google sign-in creates a new
 * account; omitted, the API falls back to the Google `given_name`, then to the
 * local part of the email.
 */
export async function googleLogin(
    idToken: string,
    givenName?: string
): Promise<ApiError | void> {
    if (!idToken) {
        return { error: 'Missing Google credential.' }
    }

    const trimmedGivenName = givenName?.trim()
    const result = await auth('/google', {
        id_token: idToken,
        ...(trimmedGivenName ? { given_name: trimmedGivenName } : {}),
    })

    if ('error' in result) {
        return result
    }

    await startSession(result)
    redirect('/home')
}
