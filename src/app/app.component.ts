import { Component, OnInit } from '@angular/core';
import { PostService } from './post.service';
import { Post } from './post';
import { SiteVisionResponse } from './SiteVisionResponse';
import { ApiResponse } from './ApiResponse';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  posts: any;
  title: any;
  messages: any;
  closeResult: string;
  url: string = "http://localhost:4201/public/messages";
  post : Post = {
    shortId: Number(''),
    headline: '',
    text: '',
    hyperlink: '',
    author: '',
    startDate: '',
    endDate: '',
    publishingDate: '',
    targetGroup: []
  };
  public fGroup = new FormGroup({
    messageTitle: new FormControl(''),
    messageText: new FormControl(''),
    messageLink: new FormControl(''),
    messageAuthor: new FormControl(''),
    messageStartDate: new FormControl(''),
    messageEndDate: new FormControl(''),
    messagePublishingDate: new FormControl(''),
    messageId: new FormControl(''),
    messageShortId: new FormControl(''),
    messageTargetGroup: new FormControl([''])
  });
  myData: string[] = ['Arbetslös', 'Basår', 'Folkhögskola', 'Gymnasiet', 'Hemutrustningslån', 'Högstadiet', 
                      'Komvux', 'Körkortslån', 'Lågstadiet', 'Mellanstadiet', 'Universitet', 'Utlandsstudier',
                      'Yrkeshögskola', 'Övriga utbildningar'];


  constructor(private _http: HttpClient, private service: PostService, private modalService: NgbModal) { }

  public siteVisionResponse: SiteVisionResponse;
  public apiResponse: ApiResponse | undefined;
  
  ngOnInit() {
    this._http.get<ApiResponse>(this.url)
      .subscribe({
        next: (data: ApiResponse) => {
          this.apiResponse = data;
        }
      });
  }

  createPost(data: {url: string; targetGroup: string[]; startDate: string; endDate: string;}) {

    this._http.get<SiteVisionResponse>(data.url)
      .subscribe({
        next: (data1: SiteVisionResponse) => {
          this.siteVisionResponse = data1;


          var date: Date = new Date(parseInt(this.siteVisionResponse.properties.publishDate));
          var day = date.getDate();
          if (day < 10) {
            var zero = 0;
            var day2 = ('' + zero + day).toString();
          } else {
            var day2 = day.toString();
          }
          var month = date.getMonth() + 1;
          if (month < 10) {
            var zero = 0;
            var month2 = ('' + zero + month).toString();
          } else {
            var month2 = month.toString();
          }
          var date2 = (date.getFullYear() + '-').toString();
          date2 = date2.concat(month2);
          date2 = date2.concat("-");
          date2 = date2.concat(day2);
          this.post.publishingDate = date2;


          const nodeList = this.siteVisionResponse.contentNodes;
      
          for (let i=0; i<nodeList.length-1; i++) {       
            if (nodeList[i]?.name.toString() == "Rubrik") {
             this.post.headline = nodeList[i]?.properties.textContent;
             break;
            }
          }

          for (let i=0; i<nodeList.length; i++) {       
            if (nodeList[i]?.name.toString() == "Innehåll") {
              this.post.text = nodeList[i]?.properties.textContent;
              break;
            }
          }

          this.post.shortId = this.siteVisionResponse.properties.shortId;
          var str3: string = "https://www.csn.se";
          this.post.hyperlink = str3.concat(this.siteVisionResponse.properties.URI.toString());
          this.post.author = this.siteVisionResponse.properties.publishedBy.properties.displayName;
          this.post.startDate = data.startDate;
          this.post.endDate = data.endDate;
          this.post.targetGroup = data.targetGroup;
          
          this.service.create(this.post);
          },
      }); 
  }

  removePost(id: number) {
    var link: string;
    link = ('http://localhost:4201/admin/messages/' + id).toString();
    this._http.delete(link)
      .subscribe(data => {
        console.log(data);
      });
    alert("Meddelandet raderades");
    window.location.reload();
  }

  
  editPost(content: any) {  
    this.post.shortId = Number(this.fGroup.controls.messageShortId.value);
    this.post.headline = this.fGroup.controls.messageTitle.value;
    this.post.text = this.fGroup.controls.messageText.value;
    this.post.hyperlink = this.fGroup.controls.messageLink.value;
    this.post.author = this.fGroup.controls.messageAuthor.value;
    this.post.startDate = this.fGroup.controls.messageStartDate.value;
    this.post.endDate = this.fGroup.controls.messageEndDate.value;
    this.post.publishingDate = this.fGroup.controls.messagePublishingDate.value;
    this.post.targetGroup = this.fGroup.controls.messageTargetGroup.value;

    var url = ('http://localhost:4201/admin/messages/' + Number(this.fGroup.controls.messageId.value)).toString();

    this._http.put<Post>(url, this.post)
      .subscribe(data => {
        console.log(data);
        alert("Meddelandet ändrades")
        window.location.reload();
      });
  }

  open(content: any, message: any) {
  
    this.fGroup.setValue({ messageTitle: message.headline, messageText: message.text, messageLink: message.hyperlink, 
      messageAuthor: message.author, messageStartDate: message.startDate, messageEndDate: message.endDate, 
      messagePublishingDate: message.publishingDate, messageTargetGroup: message.targetGroup, messageId: message.id2, 
      messageShortId: message.shortId });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

