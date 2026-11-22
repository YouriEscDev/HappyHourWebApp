'use server'
import {getApiUrl, readApiError} from "@/_utils/callApi";
import {Post} from "@/_models/posts";

export async function getPosts(){
    try {
        const data = await fetch(`${getApiUrl()}/posts`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        })
        if (!data.ok) {
            throw { error: await readApiError(data) }
        }

        return (await data.json()) as Post[]
    } catch (cause) {
        console.error(`GET /POSTS COULD NOT REACH THE API:`, cause)
        throw { error: 'UNABLE TO REACH THE SERVER. PLEASE TRY AGAIN.' }
    }
}