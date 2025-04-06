import React from 'react';
import './css/UserThumbnail.css';

// Component for the user on the top bar 

const UserThumbnail = ({ image, email, name, surname }) => {
  return (
    <div className="user-thumbnail">
      <img
        className="user-thumbnail__image"
        src={image || `https://ui-avatars.com/api/?name=${name}+${surname}`}
        alt={`${name} ${surname}`}
      />
      <div className="user-thumbnail__info">
        <h3 className="user-thumbnail__name">{name} {surname}</h3>
        <p className="user-thumbnail__email">{email}</p>
      </div>
    </div>
  );
};

export default UserThumbnail;
