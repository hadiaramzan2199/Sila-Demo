import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import Font from '@arcgis/core/symbols/Font';
import logo from './logo.png';

function App() {
  const mapDiv = useRef(null);
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedParkings, setSelectedParkings] = useState(0);
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [selectedArea, setSelectedArea] = useState(0);
  const [selectedPollutionType, setSelectedPollutionType] = useState('');
  const [hoveredGraphic, setHoveredGraphic] = useState(null);
  const [selectedGraphic, setSelectedGraphic] = useState(null);
  const [mapView, setmapView] = useState(null);
  
  useEffect(() => {
    // Esri Gray Basemap
    const map = new Map({
      basemap: 'dark-gray-vector'
    });

    // Setting he mapview
    const view = new MapView({
      map,
      container: mapDiv.current,
      center: [73.05819270866068, 33.72177377637208], 
      zoom: 14 
    });

    setmapView(view);

    const graphicsLayer = new GraphicsLayer();
    view.map.add(graphicsLayer);
    setGraphicsLayer(graphicsLayer);

    // Dummy data for demonstration
    const dummyData = [
      { geometry: [[73.04748990706791, 33.7188512743977], [73.05096030287353, 33.7206765900484], [73.05284860647366, 33.71808717725303], [73.04958235159779, 33.716176904638964], [73.04748990706791, 33.7188512743977]], attributes: { locationName: 'College', parkings: 1, distanceFromRoad: 10, area: 100, pollution: {crime: 10, noise_pollution: 20, soil_waste: 30, fire: 40, traffic: 50, flood: 60}} },
      { geometry: [[73.05238928939387, 33.7194031181519], [73.05540036810757, 33.7209737308292], [73.05605106732114, 33.71948801686911], [73.0534227528507, 33.71810840231141], [73.05238928939387, 33.7194031181519]], attributes: { locationName: 'Supermarket', parkings: 2, distanceFromRoad: 20, area: 200, pollution: {crime: 15, noise_pollution: 25, soil_waste: 35, fire: 45, traffic: 55, flood: 65 }} },
      { geometry: [[73.05593623806213, 33.72123903421084], [73.05786281808656, 33.72223656750141], [73.05904938724069, 33.721058628016245], [73.05686763105408, 33.71999740743231], [73.05593623806213, 33.72123903421084]], attributes: { locationName: 'Cafe', parkings: 3, distanceFromRoad: 30, area: 300, pollution: {crime: 20, noise_pollution: 30, soil_waste: 40, fire: 50, traffic: 60, flood: 70 } } },
      { geometry: [[73.05791385332529, 33.72226840349244], [73.05879421108482, 33.722714105944156], [73.0590876636713, 33.72210922348456, ], [73.05832213518477, 33.7218014746323], [73.05791385332529, 33.72226840349244]], attributes: { locationName: 'Playground', parkings: 4, distanceFromRoad: 40, area: 400, pollution: {crime: 25, noise_pollution: 35, soil_waste: 45, fire: 55, traffic: 65, flood: 75 } } },
      { geometry: [[73.0592024929512, 33.72287328484551], [73.05996802143774, 33.72327653670277], [73.06017216236748, 33.722671658206494], [73.05959801600257, 33.722427583220316], [73.0592024929512, 33.72287328484551]], attributes: { locationName: 'Bookstore', parkings: 5, distanceFromRoad: 50, area: 500, pollution: {crime: 30, noise_pollution: 40, soil_waste: 50, fire: 60, traffic: 70, flood: 80 } } },
      { geometry: [[73.05569301667829, 33.724226914924905], [73.0596683074084, 33.72622078333367], [73.06027522202369, 33.723987142819176], [73.05716216144258, 33.722332018572274], [73.05569301667829, 33.724226914924905]], attributes: { locationName: 'Restaurant', parkings: 6, distanceFromRoad: 60, area: 600, pollution: {crime: 35, noise_pollution: 45, soil_waste: 55, fire: 65, traffic: 75, flood: 85 } } },
      { geometry: [[73.0542914295995, 33.71816140788522], [73.05619249200774, 33.71907407789577], [73.05639663293746, 33.71855406942779], [73.05468695265087, 33.71769445668606], [73.0542914295995, 33.71816140788522]], attributes: { locationName: 'Hotel', parkings: 7, distanceFromRoad: 70, area: 700, pollution: {crime: 40, noise_pollution: 50, soil_waste: 60, fire: 70, traffic: 80, flood: 90 } } },
      // Add more dummy data as needed
    ];
    

    // Add dummy polygons to the map
    dummyData.forEach(data => {
      const symbol = new SimpleFillSymbol({
        color: [255, 0, 0, 0.5],
        outline: new SimpleLineSymbol({
          color: [255, 0, 0],
          width: 1
        })
      });

      const graphic = new Graphic({
        geometry: new Polygon({
          rings: data.geometry,
          spatialReference: view.spatialReference
        }),
        symbol,
        attributes: data.attributes
      });

      graphicsLayer.add(graphic);
    });

    // Hover functionality
    view.on('pointer-move', (event) => {
      view.hitTest(event).then((response) => {
        const graphic = response.results[0]?.graphic;
        setHoveredGraphic(graphic);
      });
    });

    // Click functionality
    view.on('click', event => {
      view.hitTest(event).then(response => {
        const clickedGraphic = response.results[0]?.graphic;
        handlePolygonClick(clickedGraphic, graphicsLayer, view);
      });
    });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update color map when the selected pollution type changes
    updateColorMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPollutionType]);

  const updateColorMap = () => {
    if (!graphicsLayer) return;

    graphicsLayer.graphics.forEach(graphic => {
      const attributes = graphic.attributes;
      const pollutionValue = attributes.pollution[selectedPollutionType];

      const fillColor = getColorForPollutionValue(pollutionValue);

      const symbol = new SimpleFillSymbol({
        color: fillColor,
        outline: new SimpleLineSymbol({
          color: fillColor,
          width: 1
        })
      });

      graphic.symbol = symbol;
    });
  };

  const getColorForPollutionValue = (value) => {
    // Define color gradients based on pollution levels
    const colorGradients = [
      { min: 0, max: 20, color: [255, 255, 255, 0.5] },
      { min: 21, max: 40, color: [0, 255, 0, 0.5] },
      { min: 41, max: 60, color: [255, 255, 0, 0.5] },
      { min: 61, max: 80, color: [255, 165, 0, 0.5] },
      { min: 81, max: 100, color: [255, 0, 0, 0.5] }
      // Add more color gradients as needed
    ];

    const defaultColor = [255, 255, 255, 0.5]; // Default color if value is not in any range
    const matchedGradient = colorGradients.find(gradient => value >= gradient.min && value <= gradient.max);

    const color = matchedGradient ? matchedGradient.color : defaultColor;

    return color;
  };
  
  const handlePolygonClick = (clickedGraphic, layer, view) => {
    setSelectedGraphic(clickedGraphic);
  
    // Remove labels for all graphics
    layer.graphics.forEach(graphic => {
      removeLabel(view, graphic);
    });
  
    // Reset the color of all graphics
    const symbol = new SimpleFillSymbol({
      color: [255, 255, 0, 0.5], // Yellow color
      outline: new SimpleLineSymbol({
        color: [255, 255, 0],
        width: 1
      })
    });
  
    layer.graphics.forEach(graphic => {
      // Check if the graphic is the clicked one
      if (graphic.uid === clickedGraphic.uid) {
        // Set the color of the clicked graphic to blue
        const blueSymbol = new SimpleFillSymbol({
          color: [0, 0, 255, 0.5], // Blue color
          outline: new SimpleLineSymbol({
            color: [0, 0, 255],
            width: 1
          })
        });
        clickedGraphic.symbol = blueSymbol;
  
        // Update the traffic flow percentage label for the clicked graphic
        const trafficFlowPercentage = calculateDummyTrafficFlowPercentage();
        const attributes = { ...clickedGraphic.attributes, trafficFlowPercentage };
        clickedGraphic.attributes = attributes;
  
        // Display the label for the clicked graphic
        // Note: We don't display label for the clicked polygon in this case
      } else {
        // Apply yellow color to unclicked polygons
        graphic.symbol = symbol;
  
        // Display label for unclicked polygons
        displayLabel(view, graphic, calculateDummyTrafficFlowPercentage());
      }
    });
  };

  const displayLabel = (view, graphic, text) => {
    // Check if graphic is defined, and if its geometry is defined
    if (graphic && graphic.geometry) {
      const geometry = graphic.geometry;
  
      // Create a point at the centroid of the graphic's geometry
      const point = geometry.centroid || geometry.extent.center;
  
      const font = new Font({
        size: 10,
        family: 'Arial',
        weight: 'bold',
      });
      
      const labeledText = text + '%';

      const textSymbol = new TextSymbol({
        text:labeledText,
        font,
        color: [255, 255, 255, 1],
        xoffset: 0, 
        yoffset: 0, 
      });
  
      const labelGraphic = new Graphic({
        geometry: point,
        symbol: textSymbol,
        attributes: { label: true },
      });
  
      view.graphics.add(labelGraphic);
      graphic.attributes.label = true; // Set label attribute for the clicked graphic
    }
  };
  
  const removeLabel = (view, graphic) => {
    if (graphic.geometry.centroid && graphic.attributes.label) {
      // Remove labels associated with the graphic
      const labels = view.graphics.filter(g => g.attributes && g.attributes.label && g.geometry.equals(graphic.geometry.centroid));
      view.graphics.removeMany(labels);
  
      graphic.attributes.label = false; // Remove label attribute for the unclicked graphic
    }
  };
  
  const calculateDummyTrafficFlowPercentage = () => {
    return Math.floor(Math.random() * 100);
  };

  const handleSearch = () => {
    console.log('Search button clicked');
    
    // Validate filter fields
    if (
      selectedLocation.trim() === '' &&
      selectedParkings === 0 &&
      selectedDistance === 0 &&
      selectedArea === 0
    ) {
      // Display an alert or throw an error
      alert('Select filter before searching');
      return;
    }
  
    // Iterate through existing graphics and update their symbols
    graphicsLayer.graphics.forEach(graphic => {
      const attributes = graphic.attributes;
      console.log('Graphic Attributes:', attributes);
      console.log('Selected Filters:', {
        selectedLocation,
        selectedParkings,
        selectedDistance,
        selectedArea,
      });
  
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
  
      // Update the symbol directly on the existing graphic
      graphic.symbol = symbol;
    });
  };
  
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
          fontFamily: 'Arial', 
          color: '#fff', 
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
          
          {/* 2nd filter section */}
          <h2 style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center' }}>Pollution Type</h2>
          <select
                style={{
                  width: '100%',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  marginTop: '5px',
                }}
                value={selectedPollutionType}
                onChange={(e) => setSelectedPollutionType(e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="crime">Crime</option>
                <option value="noise_pollution">Noise Pollution</option>
                <option value="soil_waste">Soil Waste</option>
                <option value="fire">Fire</option>
                <option value="traffic">Traffic</option>
                <option value="flood">Flood</option>
                {/* Add more pollution types as needed */}
              </select>
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
        <div ref={mapDiv} style={{ position: 'absolute', top: 0, bottom: 0, left: '0px', right: 0}} />
        {/* Tooltip for pollution values */}
        {hoveredGraphic && hoveredGraphic.geometry && selectedPollutionType && mapView &&(
        <div
          style={{
            position: 'absolute',
            top: mapView.toScreen(hoveredGraphic.geometry.centroid).y - 50, // Adjust the offset as needed
            left: mapView.toScreen(hoveredGraphic.geometry.centroid).x,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '5px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: '10px', // Adjust the font size as needed
          }}
        >
          <p style={{ margin: 0 }}>
            {selectedPollutionType} Intensity: {hoveredGraphic.attributes.pollution[selectedPollutionType]} %
          </p>
        </div>
      )}

      </div>
    </div>
  );
}

export default App;