import { Component } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { PackageService } from '../../services/package.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MapComponent } from '../../components/map/map.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { models } from '../../../utils';
import moment from 'moment';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MapComponent,
    MatProgressBarModule,
  ],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss'
})
export class TrackerComponent {

  v = this._fb.group({
    package_id: ['', [Validators.required]],
  });

  markers!: models.Location[];
  package!: models.Package | null;
  searching: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _ps: PackageService,
    private _ui: UiService,
    private _io: SocketService,
  ) {
    // 65e11072f76e146b8cb8313c
  }

  ngOnInit() {
    this.fetchPackage();
  }

  fetchPackage() {
    if (this.v.valid) {
      this.searching = true;
      this.package = null;
      this._ps.get(this.v.value.package_id as string).then(res => {
        if (res?.package_id) {
          this.markers = [
            { ...res.from_location, label: 'Source' },
            { ...res.to_location, label: 'Destination' },
          ];
          if (res.delivery.delivery_id) {
            res['delivery']['end_time'] = moment(res.delivery.end_time).format('LLL');
            res['delivery']['start_time'] = moment(res.delivery.start_time).format('LLL');
            res['delivery']['pickup_time'] = moment(res.delivery.pickup_time).format('LLL');
            this.markers = this.markers.concat({
              ...res.delivery.location,
              // icon: 'https://gozem.co/tg/wp-content/themes/gozem-theme/images/icon-zem.svg',
              label: 'Rider',
            });

            this._io.receive(models.ioEvents.delivery_updated, (msg) => {
              if (this.package && this.package.delivery && msg.delivery_id === res.delivery.delivery_id) {
                console.log(models.ioEvents.delivery_updated, msg)
                this.package.delivery['status'] = msg.status || this.package.delivery.status;
                this.package.delivery['location'] = msg.location || this.package.delivery.location;
                this.markers[2] = {
                  ...this.markers[2],
                  lat: this.markers[2].lat,
                  lng: this.markers[2].lng,
                };
              }
            });
          }
          this.package = res;
        } else {
          this._ui.openSnackBar(`Package not found`);
        }
        this.searching = false;
      });
    }
  }

}
