export interface ApiResponse {
    messages: {
        id2: number;
        shortId: number;
        headline: string;
        text: string;
        hyperlink: string;
        author: string;
        startDate: string;
        endDate: string;
        publishingDate: string;
        logo: string;
        targetGroup: string[];
    }[];
}