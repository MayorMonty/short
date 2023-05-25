

export type Domain = {
    id: number;
    TeamId: number | null;
    hostname: string;
    title: string | null;
    hasFavicon: boolean | null;
    segmentKey: string | null;
    linkType: string;
    state: string;
    redirect404: string;
    hideReferer: boolean;
    hideVisitorIp: boolean;
    caseSensitive: boolean;
    exportEnabled: boolean;
    cloaking: boolean;
    incrementCounter: string;
    setupType: string;
    httpsLinks: boolean;
    clientStorage: string | null;
    integrationGA: string | null;
    integrationFB: string | null;
    integrationAdroll: string | null;
    integrationGTM: string | null;
    webhookURL: string | null;
    httpsLevel: string;
    robots: string;
    provider: string;
    purgeExpiredLinks: boolean;
    lastPurgeDate: string | null;
    createdAt: string;
    updatedAt: string;
    faviconURL: string | null;
    unicodeHostname: string;
    isFavorite: boolean;
};

export type Link = {
    idString: string;
    path: string;
    title: string | null;
    icon: string | null;
    archived: boolean;
    originalURL: string;
    iphoneURL: string | null;
    androidURL: string | null;
    splitURL: string | null;
    expiresAt: string | null;
    expiredURL: string | null;
    redirectType: string | null;
    cloaking: string | null;
    source: null;
    AutodeleteAt: string | null;
    createdAt: string;
    updatedAt: string;
    DomainId: number;
    OwnerId: number;
    secureShortURL: string;
    shortURL: string;
}

export type LinkCreateOptions = {
    originalURL: string;
    allowDuplicates?: boolean;
    domain: string
    path?: string;
    title?: string;
    iphoneURL?: string;
    androidURL?: string;
};

export async function getter<T>([path, apiKey]: [string, string]): Promise<T> {
    const headers = new Headers();
    headers.set("Authorization", `${apiKey}`);
    headers.set("Accept", "application/json");

    const url = new URL(path, "https://short-api.bren.app");

    const response = await fetch(url, {
        headers
    }).then(r => r.json());

    if (response.error) {
        return Promise.reject(response.error);
    };

    return response;
};

export async function poster<T, A>([path, apiKey]: [string, string], { arg }: { arg: A }): Promise<T> {
    const headers = new Headers();
    headers.set("Authorization", `${apiKey}`);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json")

    const url = new URL(path, "https://short-api.bren.app");

    const response = await fetch(url, {
        headers,
        method: "POST",
        body: JSON.stringify(arg)
    }).then(r => r.json());

    if (response.error) {
        return Promise.reject(response.error);
    };

    return response;
};

export function customFetcher<T>(options: RequestInit, postProcess: (response: Response) => Promise<T>) {
    return async function ([path, apiKey]: [string, string]): Promise<T> {
        const headers = new Headers(options?.headers);
        headers.set("Authorization", `${apiKey}`);
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json")

        const url = new URL(path, "https://short-api.bren.app");

        const response = await fetch(url, {
            headers,
            ...options
        });

        return postProcess(response);
    };
};