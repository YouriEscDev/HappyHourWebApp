export function getApiUrl(): string {
    const baseUrl = process.env.API_BASE_URL

    if (!baseUrl) {
        throw new Error(
            'API_BASE_URL is not defined. Point it at the Rust API, e.g. http://127.0.0.1:3000'
        )
    }
    return `${baseUrl.replace(/\/+$/, '')}`
}

/**
 * Pulls the message out of an `ApiError` body. Falls back to the status code
 * if the body isn't the expected JSON — that means something upstream of the
 * API answered (a proxy, a crashed process), not a handler.
 */
export async function readApiError(response: Response): Promise<string> {
    try {
        const body: unknown = await response.json()

        if (
            typeof body === 'object' &&
            body !== null &&
            'error' in body &&
            typeof body.error === 'string' &&
            body.error.trim()
        ) {
            return body.error.trim()
        }
    } catch {
        console.error("Body wasn't JSON at all.")
    }

    return `Request failed (${response.status})`
}