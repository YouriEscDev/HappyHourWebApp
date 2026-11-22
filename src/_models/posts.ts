import {Address} from "@/_models/address";

export type Post = {
    body: string;
    user_id: string;
    id: string;
    img_url: string;
    store_id: string;
    title: string;
    created_date: string;
    updated_date: string;
    address: Address;
}
