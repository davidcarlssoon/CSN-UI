export interface Post {
    shortId: number | null;
    headline: string | null;
    text: string | null;
    hyperlink: string | null;
    author: string | null;
    startDate: string | null;
    endDate: string | null;
    publishingDate : string | null;
    targetGroup: string[] | null;
}