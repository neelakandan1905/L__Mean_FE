import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[]= [];
  private postUpdated = new Subject<Post[]>();

constructor(private http: HttpClient) { }

  getPost() {
    // []the array bracket here used is spread operator 
    //which helps to create a new object and put the only values in to the array by using the ...
    // return [...this.posts];

    // this.http.get('http://localhost:3000/mean/posts').subscribe((res: any) => {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/mean/posts')
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

  addPost(obj: any){
    const post: Post = {id: obj?.id , title: obj.title, content: obj.content };
    this.http.post<{message: string}>('http://localhost:3000/mean/post', post).subscribe((res:any) => {
      console.log(res);
      this.posts.push(post);
      this.postUpdated.next([...this.posts])
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