import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from './../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-listing',
  templateUrl: './post-listing.component.html',
  styleUrls: ['./post-listing.component.css']
})
export class PostListingComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'Post One', content: 'This is the first post'},
  //   {title: 'Post two', content: 'This is the two post'},
  //   {title: 'Post three', content: 'This is the three post'},
  //   {title: 'Post four', content: 'This is the four post'},
  // ];
 posts:Post[] = [];
 private postSub: Subscription | any;
 isLoading = false;
  
  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPost();
    this.isLoading = true;
    this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string){
    console.log(postId);
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
