import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-google-maps-demo',
  templateUrl: './google-maps-demo.component.html',
})
export class GoogleMapsDemoComponent implements OnInit {

  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = {lat: 40, lng: -20};
  zoom = 18;

  // Initialize and add the map
// function initMap(): void {
//   // The location of Uluru
//   const uluru = { lat: -25.344, lng: 131.036 };
//   // The map, centered at Uluru
//   const map = new google.maps.Map(
//     document.getElementById("map") as HTMLElement,
//     {
//       zoom: 4,
//       center: uluru,
//     }
//   );

//   // The marker, positioned at Uluru
//   const marker = new google.maps.Marker({
//     position: uluru,
//     map: map,
//   });
// }

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + environment.googleApiKey, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    this.updateCurrentPosition();
  }

  updateCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    this.center = {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude};
    console.log('Current position:', coordinates);
  };

}
