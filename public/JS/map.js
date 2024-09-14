
  // Add your Mapbox access token
 
  console.log(mapToken);
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // style URL
    center: singleList.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
  });

console.log(singleList.geometry.coordinates);

  const marker = new mapboxgl.Marker({color:'red'})
  .setLngLat(singleList.geometry.coordinates) // Marker position [lng, lat]
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // Create a pop-up
    .setHTML(`<h4>${singleList.location}</h4><h1>Location will be provide later on</h1>`))
  .addTo(map); // Add marker to the map

  let hoveredPolygonId = null;

  map.on('load', () => {
      map.addSource('states', {
          'type': 'geojson',
          'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      map.addLayer({
          'id': 'state-fills',
          'type': 'fill',
          'source': 'states',
          'layout': {},
          'paint': {
              'fill-color': '#627BC1',
              'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.5
              ]
          }
      });

      map.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'layout': {},
          'paint': {
              'line-color': '#627BC1',
              'line-width': 2
          }
      });

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      map.on('mousemove', 'state-fills', (e) => {
          if (e.features.length > 0) {
              if (hoveredPolygonId !== null) {
                  map.setFeatureState(
                      { source: 'states', id: hoveredPolygonId },
                      { hover: false }
                  );
              }
              hoveredPolygonId = e.features[0].id;
              map.setFeatureState(
                  { source: 'states', id: hoveredPolygonId },
                  { hover: true }
              );
          }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'state-fills', () => {
          if (hoveredPolygonId !== null) {
              map.setFeatureState(
                  { source: 'states', id: hoveredPolygonId },
                  { hover: false }
              );
          }
          hoveredPolygonId = null;
      });
  });