interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
}

interface GoogleAccountsId {
    initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
    }) => void;

    renderButton: (
        parent: HTMLElement,
        options: {
            type?: string;
            shape?: string;
            theme?: string;
            text?: string;
            size?: string;
            logo_alignment?: string;
            width?: number;
        },
    ) => void;
}

interface GoogleAccounts {
    id: GoogleAccountsId;
}

interface Google {
    accounts: GoogleAccounts;
}

declare global {
    interface Window {
        google: Google;
    }
}

export {};