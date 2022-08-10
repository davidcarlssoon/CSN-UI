import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteVisionResponse } from './SiteVisionResponse';
import { Post } from './post';

  
@Injectable({
  providedIn: 'root'
})

export class PostService {
  private url: string = 'http://localhost:4201/admin/messages';

  constructor(private httpClient: HttpClient) { }
  
  getPosts(link: string) {
    return this.httpClient.get<SiteVisionResponse>(link);
  }

  create(post: Post) {
    this.httpClient.post<Post>(this.url, post)
        .subscribe(response => {
        });
        
    alert("Ditt meddelande har lagts till.");
    window.location.reload();
  }
}
