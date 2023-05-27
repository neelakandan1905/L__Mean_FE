import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle:any = '';
  enteredContent:any = '';
  private mode = 'create';
  private postId: any = '';
  postRowData: any;
  isLoading = false;


  constructor(public postService: PostService, 
              public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getOnePostData(this.postId).subscribe(res =>{
          this.isLoading = false;
          this.postRowData = {id: res._id, title: res.title, content: res.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost(postForm: NgForm) {
    if(postForm.invalid){
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id : 'null',
      title : postForm.value.title,
      content : postForm.value.content
    };
    if(this.mode === 'create'){
      this.postService.addPost(post);
    } else {
      const updateObj = {
        id: this.postId,
        title : postForm.value.title,
        content : postForm.value.content
      }
      this.postService.updatePost(this.postId, updateObj)
    }
    postForm.resetForm();
  }
}
