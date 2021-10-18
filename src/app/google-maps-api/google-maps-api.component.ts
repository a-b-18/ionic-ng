import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-google-maps-api',
  templateUrl: './google-maps-api.component.html',
})
export class GoogleMapsApiComponent implements OnInit {

  apiLoaded: Observable<boolean>;
  userLocation: google.maps.LatLngLiteral;
  customLocation: google.maps.LatLngLiteral;
  zoom = 18;
  map: google.maps.Map;

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + environment.googleApiKey, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  initMap(): void {
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 4,
        center: { lat: -25.363882, lng: 131.044922 },
      }
    );

    this.map.addListener('click', (e) => {
      this.placeMarkerAndPanTo(e.latLng);
    });
  }

  placeMarkerAndPanTo(latLng: google.maps.LatLng) {
    new google.maps.Marker({
      position: latLng,
      map: this.map,
    });
    this.map.panTo(latLng);
  }


  ngOnInit() {
    this.updateCurrentPosition();
  }

  updateCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    this.userLocation = {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude};
    console.log('Current position:', coordinates);
  };

}
