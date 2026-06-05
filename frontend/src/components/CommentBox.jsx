import React from 'react';

const CommentBox = ({ comments = [] }) => (
  <div style={{ display: 'grid', gap: '8px' }}>
    {comments.map((comment, index) => (
      <p
        key={index}
        style={{
          margin: 0,
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.72)',
        }}
      >
        {comment}
      </p>
    ))}
  </div>
);

export default CommentBox;