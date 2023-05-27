import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './posts/post.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private titleService: Title) { }

  ngOnInit() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.titleService.setTitle('MeanLearning 🟡');
      } else {
        this.titleService.setTitle('MeanLearning 🟢');
      }
    });
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', () => {});
  }

  storedPosts:any = [];

  onPostAdded(post:Post) {
    this.storedPosts.push(post);
  }
}
