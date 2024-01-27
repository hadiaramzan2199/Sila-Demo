import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'; // Import GraphicsLayer
import logo from './logo.png';

function App() {
  const mapDiv = useRef(null);
  const [graphicsLayer, setGraphicsLayer] = useState(null);

  useEffect(() => {
    const map = new Map({
      basemap: 'dark-gray-vector'
    });

    const view = new MapView({
      map,
      container: mapDiv.current,
      center: [73.05819270866068, 33.72177377637208], // Islamabad coordinates [longitude, latitude]
      zoom: 14 // Adjust zoom level as needed
    });

    const graphicsLayer = new GraphicsLayer();
    view.map.add(graphicsLayer);
    setGraphicsLayer(graphicsLayer);

    // Dummy data for demonstration
    const dummyData = [
      { geometry: [[73.04748990706791, 33.7188512743977], [73.05096030287353, 33.7206765900484], [73.05284860647366, 33.71808717725303], [73.04958235159779, 33.716176904638964], [73.04748990706791, 33.7188512743977]], attributes: { locationName: 'College', parkings: 10, distanceFromRoad: 50, area: 500 } },
      { geometry: [[73.05238928939387, 33.7194031181519], [73.05540036810757, 33.7209737308292], [73.05605106732114, 33.71948801686911], [73.0534227528507, 33.71810840231141], [73.05238928939387, 33.7194031181519]], attributes: { locationName: 'Resturant', parkings: 20, distanceFromRoad: 150, area: 1200 } },
      { geometry: [[73.05593623806213, 33.72123903421084], [73.05786281808656, 33.72223656750141], [73.05904938724069, 33.721058628016245], [73.05686763105408, 33.71999740743231], [73.05593623806213, 33.72123903421084]], attributes: { locationName: 'Supermarket', parkings: 5, distanceFromRoad: 80, area: 800 } },
      { geometry: [[73.05791385332529, 33.72226840349244], [73.05879421108482, 33.722714105944156], [73.0590876636713, 33.72210922348456, ], [73.05832213518477, 33.7218014746323], [73.05791385332529, 33.72226840349244]], attributes: { locationName: 'Bookstore', parkings: 15, distanceFromRoad: 120, area: 600 } },
      { geometry: [[73.0592024929512, 33.72287328484551], [73.05996802143774, 33.72327653670277], [73.06017216236748, 33.722671658206494], [73.05959801600257, 33.722427583220316], [73.0592024929512, 33.72287328484551]], attributes: { locationName: 'Cafe', parkings: 0, distanceFromRoad: 200, area: 400 } },
      { geometry: [[73.05569301667829, 33.724226914924905], [73.0596683074084, 33.72622078333367], [73.06027522202369, 33.723987142819176], [73.05716216144258, 33.722332018572274], [73.05569301667829, 33.724226914924905]], attributes: { locationName: 'Playground', parkings: 3, distanceFromRoad: 90, area: 700 } },
      { geometry: [[73.0542914295995, 33.71816140788522], [73.05619249200774, 33.71907407789577], [73.05639663293746, 33.71855406942779], [73.05468695265087, 33.71769445668606], [73.0542914295995, 33.71816140788522]], attributes: { locationName: 'Hotel', parkings: 10, distanceFromRoad: 150, area: 1000 } },

      // Add more dummy data as needed
    ];
    

    // Add dummy polygons to the map
    dummyData.forEach(data => {
      const polygon = new Polygon({
        rings: data.geometry,
        spatialReference: view.spatialReference
      });

      const symbol = new SimpleFillSymbol({
        color: [255, 0, 0, 0.5],
        outline: new SimpleLineSymbol({
          color: [255, 0, 0],
          width: 1
        })
      });

      const graphic = new Graphic({
        geometry: polygon,
        symbol,
        attributes: data.attributes
      });

      graphicsLayer.add(graphic);
    });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  const handleSearch = () => {
    graphicsLayer.graphics.forEach(graphic => {
      const attributes = graphic.attributes;
  
      let symbol;
  
      // Check if the polygon meets the filter conditions
      if (
        attributes.locationName === selectedLocation &&
        attributes.parkings >= selectedParkings &&
        attributes.distanceFromRoad <= selectedDistance &&
        attributes.area >= selectedArea
      ) {
        // Highlight the polygon
        symbol = new SimpleFillSymbol({
          color: [0, 255, 0, 0.5], // Green color for highlight
          outline: new SimpleLineSymbol({
            color: [0, 255, 0],
            width: 1
          })
        });
      } else {
        // Dim the polygon
        symbol = new SimpleFillSymbol({
          color: [100, 100, 100, 0.5], // Gray color for dimming
          outline: new SimpleLineSymbol({
            color: [100, 100, 100],
            width: 1
          })
        });
      }
  
      graphic.symbol = symbol;
    });
  };
  

  // State for user input
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedParkings, setSelectedParkings] = useState(0);
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [selectedArea, setSelectedArea] = useState(0);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '250px',
          padding: '20px',
          background: '#000',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Arial', // Change the font family as needed
          color: '#fff', // Set font color to white
          fontSize: '10px',
        }}
      >
        <div>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Filters</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Location Name:
              <select
                style={{ width: '100%', padding: '5px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="College">College</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Cafe">Cafe</option>
                <option value="Playground">Playground</option>
                <option value="Bookstore">Bookstore</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                {/* Add more options as needed */}
              </select>
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              No. of Parkings:
              <input
                style={{ width: '93%', padding: '7px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                type="number"
                value={selectedParkings}
                onChange={(e) => setSelectedParkings(parseInt(e.target.value))}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Distance from Road (m):
              <input
                style={{ width: '93%', padding: '7px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                type="number"
                value={selectedDistance}
                onChange={(e) => setSelectedDistance(parseInt(e.target.value))}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Minimum Square Meter Area:
              <input
                style={{ width: '93%', padding: '7px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                type="number"
                value={selectedArea}
                onChange={(e) => setSelectedArea(parseInt(e.target.value))}
              />
            </label>
          </div>
          <button
            style={{
              width: '50%',
              padding: '8px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              marginLeft: '50px',
            }}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div>
          <img
            src={logo}
            alt="Logo"
            style={{ width: '50%', marginTop: '20px', marginLeft: '60px' }}
          />
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div ref={mapDiv} style={{ position: 'absolute', top: 0, bottom: 0, left: '0px', right: 0 }} />
      </div>
    </div>
  );
}

export default App;