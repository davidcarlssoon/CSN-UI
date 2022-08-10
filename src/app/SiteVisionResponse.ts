export interface SiteVisionResponse {
  properties: {
    shortId: number;
    publishedBy: {
      properties: {
        displayName: string;
      }
    }
    URI: string;
    publishDate: string;
  },
  contentNodes: 
    {
      type: string;
      name: string;
      properties: { textContent: string };
    }[];
}