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
  private posts: Post[]= [];
  private postUpdated = new Subject<Post[]>();

constructor(private http: HttpClient, private router: Router) { }

  getPost() {
    // spread operator 
    // which helps to create a new object and put the only values in to the array by using the ...
    // return [...this.posts];

    // this.http.get('http://localhost:3000/mean/posts').subscribe((res: any) => {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/mean/post')
    .pipe(map((postData) => {
      return postData.posts.map((post: any) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe(transformedPost => {
      this.posts = transformedPost;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getOnePostData(id: string) {
    // return {...this.posts.find(p => p.id == id)};
    return this.http.get<any>(`http://localhost:3000/mean/post/${id}`);
  }

  addPost(obj: any){
    const post: Post = {id: obj?.id , title: obj.title, content: obj.content };
    this.http.post<{message: string}>('http://localhost:3000/mean/post', post).subscribe((res:any) => {
      console.log(res);
      const id = res.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })   
  }

  updatePost(id: string, obj: any) {
    const post: Post = {id: obj?.id , title: obj.title, content: obj.content};
    this.http.put(`http://localhost:3000/mean/post/${id}`, post).subscribe(response => {
      const updatePosts = [...this.posts];
      const oldPostIndex = updatePosts.findIndex(p => p.id === post.id);
      updatePosts[oldPostIndex] = post;
      this.posts = updatePosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })
  }

  deletePost(postId: string){
    this.http.delete(`http://localhost:3000/mean/post/${postId}`).subscribe(() => {
      console.log('deleted');
      const updatePost = this.posts.filter(post => post.id !== postId);
      this.posts = updatePost;
      this.postUpdated.next([...this.posts]);
    })
  }
}