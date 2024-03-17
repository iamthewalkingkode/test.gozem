import { Component, EventEmitter, Input, Output } from '@angular/core';
import { helpers, models } from '../../../utils';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    MatProgressBarModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  @Input() size: 'middle' | 'large' = 'middle';
  @Input() refresh: number = 0;
  @Input() markers!: models.Location[];
  @Input() showMyLocation: boolean = true;

  @Output() location: EventEmitter<any> = new EventEmitter();

  id = helpers.randCode(12);
  zoom = 16;
  locating: boolean = true;
  refreshInt: any;

  oms: any;
  map: any;
  marker!: models.Location;

  constructor() {

  }

  ngAfterViewInit() {
    this.oms = (window as any)['L'];
    this.map = this.oms.map(this.id).setView([0, 0], this.zoom);
    this.oms.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.zoom,
    }).addTo(this.map);

    if (navigator.geolocation) {
      this.getMylocation();
      for (let m = 0; m < this.markers.length; m++) {
        this.addMarker(this.markers[m], false);
      }

      if (this.refresh > 0) {
        this.refreshInt = setInterval(() => {
          this.getMylocation();
          // console.log('refreshInt', this.refresh);
        }, this.refresh * 1000);
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.refreshInt);
  }

  addMarker(loc: models.Location, locale = true) {
    const self = this;
    let markerIcon: any = { draggable: locale };
    if (loc.icon) {
      markerIcon['icon'] = this.oms.icon({
        iconUrl: loc.icon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    }
    const marker = this.oms.marker([loc.lat, loc.lng], markerIcon).addTo(this.map);
    loc.label && marker.bindPopup(loc.label);
    if (locale) {
      this.marker && this.map.removeLayer(this.marker);
      this.marker = marker;
      marker.on('dragend', () => {
        const markerLocation = marker.getLatLng();
        self.location.emit(helpers.copyObject(markerLocation));
      });
    }
  }

  getMylocation() {
    const self = this;
    this.locating = true;
    navigator.geolocation.getCurrentPosition((pos: any) => {
      const loc = [pos.coords.latitude, pos.coords.longitude];
      self.location.emit({ lat: loc[0], lng: loc[1] });
      this.map.locate({ setView: true, maxZoom: this.zoom });
      this.showMyLocation && this.addMarker({ lat: loc[0], lng: loc[1] });

      // this.map.on('click', function () {
      //   marker.setLatLng(event.latlng);
      //   var markerLocation = marker.getLatLng();
      //   self.location.emit(helpers.copyObject(markerLocation));
      // });
      this.locating = false;
    }, (e) => {
      console.log(e);
    });
  }

}
