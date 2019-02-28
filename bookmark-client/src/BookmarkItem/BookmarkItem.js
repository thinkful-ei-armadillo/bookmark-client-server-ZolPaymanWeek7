import React from 'react';
import Rating from '../Rating/Rating';
import { Link } from 'react-router-dom';
import './BookmarkItem.css';

export default function BookmarkItem(props) {
  return (
    <li className='BookmarkItem'>
      <div className='BookmarkItem__row'>
        <h3 className='BookmarkItem__title'>
          <a
            href={props.url}
            target='_blank'
            rel='noopener noreferrer'>
            {props.title}
          </a>
        </h3>
        <Rating value={props.rating} />
      </div>
      <p className='BookmarkItem__description'>
        {props.description}
      </p>
      <div className='BookmarkItem__buttons'>
        <button>
          <Link to={`/edit/${props.id}`}>Edit Bookmark</Link>
        </button>
        <button
          className='BookmarkItem__description'
          onClick={() => props.onClickDelete(props.id)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
}
