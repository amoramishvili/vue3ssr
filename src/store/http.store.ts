import axios from "axios";
import type { AxiosInstance } from "axios";

interface HttpOpts {
    baseApiUrl: string;
}

interface Http {
    request: AxiosInstance | null;
    init: (opts: HttpOpts) => void;
}

function createHttpClient({ baseApiUrl }) {
    const request = axios.create({
        baseURL: baseApiUrl,
        timeout: 5000
    });

    return request;
}

const http: Http = {
    request: null,
    init(opts: HttpOpts) {
        this.request = createHttpClient(opts);
    }
};

export default http;
