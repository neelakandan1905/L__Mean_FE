import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: any = '';
  enteredContent: any = '';
  private mode = 'create';
  private postId: any = '';
  postRowData: any;
  isLoading = false;
  form: FormGroup | any;
  imgPreview: string | undefined;
  onImageEdit = false;


  constructor(public postService: PostService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.onImageEdit = true;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getOnePostData(this.postId).subscribe(res => {
          this.isLoading = false;
          this.postRowData = { id: res._id, title: res.title, content: res.content, imagePath: res.imagePath };
          this.form.setValue({
            'title': this.postRowData.title,
            'content': this.postRowData.content,
            'image': this.onImageEdit? 
                  this.postRowData.imagePath.replace('http://localhost:3000', 'file:///D:/Own%20Projects/MEAN%20Stack/mean-learning-BE/L__Mean_BE/postImages') 
                  : this.postRowData.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.onImageEdit = false;
        this.postId = null;
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    this.onImageEdit = false;
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post = {
      id: 'null',
      title: this.form.value.title,
      content: this.form.value.content,
      image: this.form.value.image
    };
    if (this.mode === 'create') {
      this.onImageEdit = false;
      this.postService.addPost(post);
    } else {
      const updateObj = {
        id: this.postId,
        title: this.form.value.title,
        content: this.form.value.content,
        image: this.form.value.image
      }
      this.postService.updatePost(this.postId, updateObj)
    }
    this.form.reset();
  }
}
