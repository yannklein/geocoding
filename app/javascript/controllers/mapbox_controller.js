import { Controller } from '@hotwired/stimulus'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

export default class extends Controller {
  // static targets = [ 'test' ]
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    // console.log(this.apiKeyValue)
    console.log(this.markersValue)
    this.createMap()
    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl }))
  }

  createMap () {
    mapboxgl.accessToken = this.apiKeyValue
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/yannlucklein/cl5x7xde3000514lc2sr1bt0f/draft"
    })
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      //create popup
      const popup = new mapboxgl.Popup().setHTML(marker.info_window)

      // Create a HTML element for your custom marker
      const customMarker = document.createElement("div")
      customMarker.className = "marker"
      customMarker.style.backgroundImage = `url('${marker.image_url}')`
      customMarker.style.backgroundSize = "contain"
      customMarker.style.width = "25px"
      customMarker.style.height = "25px"
      customMarker.style.borderRadius = "50%"

      new mapboxgl.Marker(customMarker)
        .setLngLat([ marker.longitude, marker.latitude ])
        .setPopup(popup)
        .addTo(this.map)
    });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.longitude, marker.latitude ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 20, duration: 1000 })
  }
}
