import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], count: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPost(postsPerPage: number, currentPage: number) {
    const parms = `?pageSize=${postsPerPage}&page=${currentPage}`
    // spread operator 
    // which helps to create a new object and put the only values in to the array by using the ...
    // return [...this.posts];

    // this.http.get('http://localhost:3000/mean/posts').subscribe((res: any) => {
    this.http
      .get<{ message: string; posts: any; count: number }>(
        'http://localhost:3000/mean/post' + parms
      )
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              id: post._id
            };
          }),
          count: postData.count,
        };
      })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          count: transformedPostData.count,
        });
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getOnePostData(id: string) {
    // return {...this.posts.find(p => p.id == id)};
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/mean/post/${id}`);
  }

  addPost(obj: any) {
    // const post: Post = {id: obj?.id , title: obj.title, content: obj.content };
    const postData = new FormData();
    postData.append('title', obj.title);
    postData.append('content', obj.content);
    postData.append('image', obj.image, obj.title);
    this.http.post<{ message: string }>('http://localhost:3000/mean/post', postData).subscribe((res: any) => {
      console.log(res);
      // const post: Post = { id: res?.post.id, title: obj.title, content: obj.content, imagePath: res.post.imagePath };
      // // const id = res.postId;
      // // post.id = id;
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })
  }

  updatePost(id: string, obj: any) {
    let postData: any;
    if (typeof (obj.image) === 'object') {
      postData = new FormData();
      postData.append("id", obj.id);
      postData.append("title", obj.title);
      postData.append("content", obj.content);
      postData.append("image", obj.image, obj.title);
    } else {
      postData = { id: obj?.id, title: obj.title, content: obj.content, imagePath: obj.image };
    }
    console.log(postData);
    this.http.put(`http://localhost:3000/mean/post/${id}`, postData).subscribe(response => {
      // const updatePosts = [...this.posts];
      // const oldPostIndex = updatePosts.findIndex(p => p.id === obj.id);
      // const post: Post = { id: obj?.id, title: obj.title, content: obj.content, imagePath: '' };
      // updatePosts[oldPostIndex] = post;
      // this.posts = updatePosts;
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/mean/post/${postId}`);
    // .subscribe(() => {
    //   console.log('deleted');
    //   const updatePost = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatePost;
    //   this.postUpdated.next([...this.posts]);
    // })
  }
}