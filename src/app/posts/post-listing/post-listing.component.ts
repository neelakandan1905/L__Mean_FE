import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from './../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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

 totalPosts = 0;
 postsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1,2,5,10];
  
  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPost(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postSub = this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], count: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.count;
      this.posts = postData.posts;
    });
  }

  onChangedPage(event: PageEvent){
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postService.getPost(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string){
    console.log(postId);
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPost(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
