import { map, Observable } from 'rxjs';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  public posts$!: Observable<Post[]>;

  constructor(private postService: PostService) {}

  public ngOnInit(): void {
    this.posts$ = this.postService
      .getPosts()
      .pipe(map((posts) => posts.sort((a, b) => b.id - a.id)));
  }
}
