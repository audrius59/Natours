/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXVkcml1czU5IiwiYSI6ImNrOTJ2eDEzajA3cmozaG90Y2JmaXljc2QifQ.fnf3HuJlPwFEf8xrJsifhg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/audrius59/ck92we0h82koh1ioa5u5px5dh',
    scrollZoom: false
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //   add amrker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend map bounds to include current locations
    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  });
};
