import React from 'react';
import { Link } from 'react-router-dom';

// Example data for stadiums – update with all 17 stadiums as needed.
const stadiums = [
  {
    id: 'fatorda',
    name: "Fatorda Stadium",
    thumbnail: "/image/Fatorda-stadium-exterior.jpg",
    
  },
  {
    id: 'bambolim',
    name: "Bambolim Stadium",
    thumbnail: "/image/bambolimstadium.jpg",
    
  },
  {
    id: 'Peddem',
    name: "Peddem sports complex",
    thumbnail: "/image/peddem.jpg",
    
  },
  {
    id: 'Ponda Complex',
    name: "Ponda sports complex",
    thumbnail: "/image/ponda.jpg",
    
  },
  {
    id: 'Campal',
    name: "Campal Indoor Stadium",
    thumbnail: "/image/bambolimstadium.jpg",
    
  },
  {
    id: 'Navelim',
    name: "Navelim Indoor Stadium",
    thumbnail: "/image/bambolimstadium.jpg",
    
  },
  {
    id: 'Tilak',
    name: "Tilak Maidan ",
    thumbnail: "/image/bambolimstadium.jpg",
    
  },
  
  // ... add your remaining stadium objects here (total 17)
];

const PhotoGallery = () => {
  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Stadiums Gallery</h2>
      <div className="stadium-grid">
        {stadiums.map((stadium) => (
          <Link to={`/photo-gallery/${stadium.id}`} key={stadium.id} className="stadium-item">
            <img
              src={stadium.thumbnail}
              alt={stadium.name}
              className="stadium-thumbnail"
            />
            <h3 className="stadium-name">{stadium.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;

