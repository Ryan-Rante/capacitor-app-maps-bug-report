import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map: GoogleMap | undefined;
  @ViewChild('mapElement') mapElement: ElementRef<HTMLElement> | undefined;

  constructor() {}

  async ionViewDidEnter() {
    if (typeof this.mapElement === 'undefined') {
      return;
    }

    let getPosition = await this.getCurrentPosition();
    if (typeof getPosition === 'undefined') {
      return;
    }

    if (Capacitor.getPlatform() === 'android') {
      document.body.style.background = 'transparent';
    }

    let key: string;
    if (typeof environment['google-key'] === 'string') {
      key = environment['google-key'];
    } else {
      return;
    }

    try {
      this.map = await GoogleMap.create({
        apiKey: key,
        element: this.mapElement.nativeElement,
        id: 'maps',
        config: {
          center: {
            lat: getPosition.coords.latitude,
            lng: getPosition.coords.longitude,
          },
          zoom: 17,
          gestureHandling: 'greedy',
          disableDefaultUI: false,
          streetViewControl: false,
        },
      });
    } catch (_err) {
      console.error(_err);
    }

    if (typeof this.map === 'undefined') {
      return;
    }

    // Set camera position
    await this.map.setCamera({
      coordinate: {
        lat: getPosition.coords.latitude,
        lng: getPosition.coords.longitude,
      },
      animate: true,
      zoom: 17,
    });

    await this.map.addMarker({
      coordinate: {
        lat: getPosition.coords.latitude,
        lng: getPosition.coords.longitude,
      },
      draggable: true,
      title: 'You are here!',
      zIndex: 1000,
    });

    await this.map.setOnMarkerClickListener((event) => {
      console.log('marker on click', event);
      event.title = 'You are here!';
    });

    await this.map.setOnMarkerDragEndListener((event) => {
      console.log('on drag end triggered', event);
      event.title = 'Your location is updated!';
    });
  }

  private async getCurrentPosition() {
    let positions: Position | undefined;
    try {
      positions = await Geolocation.getCurrentPosition();
    }
    catch (_err) {
      console.error(_err);
    }
    return positions;
  }
}
