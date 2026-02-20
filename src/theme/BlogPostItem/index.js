import React from 'react';
import OriginalBlogPostItem from '@theme-original/BlogPostItem';
import GiscusComments from '@site/src/components/GiscusComments';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

export default function BlogPostItem(props) {
  const {isBlogPostPage} = useBlogPost();
  
  return (
    <>
      <OriginalBlogPostItem {...props} />
      {isBlogPostPage && (
        <div style={{ marginTop: '3rem' }}>
          <GiscusComments />
        </div>
      )}
    </>
  );
}
