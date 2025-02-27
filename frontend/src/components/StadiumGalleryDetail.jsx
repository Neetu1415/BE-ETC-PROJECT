import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Use the same stadium data for simplicity (you might import it from a separate file)
const stadiums = [
  {
    id: 'fatorda',
    name: "Fatorda Stadium",
    thumbnail: "/image/Fatorda-stadium-exterior.jpg",
    images: [
      "/image/Fatorda-stadium-exterior.jpg",
      "/image/Fatorda2.jpg",
      "/image/Fatorda3.jpg"
    ]
  },
  {
    id: 'bambolim',
    name: "Bambolim Stadium",
    thumbnail: "/image/bambolimstadium.jpg",
    images: [
      "/image/bambolimstadium.jpg",
      "/image/Bambolim2.jpg",
      "/image/Bambolim3.jpg"
    ]
  },
  {
    id: 'Peddem',
    name: "Peddem sports complex",
    thumbnail: "/image/peddem.jpg",
    images: [
      "/image/swpeddem.jpg",
      "/image/bdpeddem.jpg",
      "/image/atheleticpeddem.jpg"
    ]
  },
  {
    id: 'Ponda Complex',
    name: "Ponda sports complex",
    thumbnail: "/image/ponda.jpg",
    images: [
      "/image/bdponda.jpg",
      "/image/sw1ponda.jpg",
      "/image/swponda.jpg",
      "/image/sw2ponda.JPG"
    ]
  },
  {
    id: 'Campal',
    name: "Campal Indoor Stadium",
    thumbnail: "/image/bambolimstadium.jpg",
    images: [
      "/image/swcampal.jpg",
      "/image/bdcampal.jpg",
      "/image/bd1campal.jpeg"
    ]
  },
  {
    id: 'Tilak',
    name: "CTilak Maidan",
    thumbnail: "/image/bambolimstadium.jpg",
    images: [
      "/image/swcampal.jpg",
      "/image/bdcampal.jpg",
      "/image/bd1campal.jpeg"
    ]
  },
  {
    id: 'Navelim',
    name: "Navelim Indoor Stadium",
    thumbnail: "/image/bambolimstadium.jpg",
    images: [
      "/image/swcampal.jpg",
      "/image/bdcampal.jpg",
      "/image/bd1campal.jpeg"
    ]
  },

  // ... include the rest of the stadium objects
];

const StadiumGalleryDetail = () => {
  const { id } = useParams();
  const stadium = stadiums.find((s) => s.id === id);

  if (!stadium) {
    return <div>Stadium not found.</div>;
  }

  return (
    <div className="stadium-detail-container">
      <h2 className="stadium-detail-title">{stadium.name} Gallery</h2>
      <div className="stadium-detail-grid">
        {stadium.images.map((img, index) => (
          <div key={index} className="stadium-detail-item">
            <img src={img} alt={`${stadium.name} ${index + 1}`} className="stadium-detail-image" />
          </div>
        ))}
      </div>
      <Link to="/photo-gallery" className="back-link">Back to Stadiums</Link>
    </div>
  );
};

export default StadiumGalleryDetail;
