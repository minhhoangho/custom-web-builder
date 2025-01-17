import { fakerEN } from '@faker-js/faker';

import { Post } from '@app/entity';
import { define } from 'typeorm-seeding';
import { PostStatus } from '@app/post/constants';

define(Post, (_faker): Post => {
  const post = new Post();
  post.title = fakerEN.music.songName();
  post.description = fakerEN.lorem.paragraph(5);
  post.content = fakerEN.lorem.paragraphs(10);
  post.categoryId = fakerEN.number.int({ min: 1, max: 9 });
  post.authorId = fakerEN.number.int({ min: 1, max: 9 });
  post.thumbnail = fakerEN.image.urlLoremFlickr({ width: 300, height: 300 });
  post.cover = fakerEN.image.urlLoremFlickr({ width: 900, height: 400 });
  post.status = PostStatus.Published;

  return post;
});
