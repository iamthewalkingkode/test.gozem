import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiService } from '../../services/ui.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapComponent } from '../../components/map/map.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DeliveryService } from '../../services/delivery.service';
import { SocketService } from '../../services/socket.service';
import { models } from '../../../utils';
import moment from 'moment';

@Component({
  selector: 'app-driver',
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
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent {
  
  v = this._fb.group({
    delivery_id: ['', [Validators.required]],
  });
  markers!: models.Location[];
  delivery: models.Delivery | null = null;
  searching: boolean = false;
  location!: models.Location;

  constructor(
    private _fb: FormBuilder,
    private _ds: DeliveryService,
    private _ui: UiService,
    private _io: SocketService,
  ) {
    // 65e18e46f76e146b8cb8313d
  }

  ngOnInit() {
    this.fetchDelivery();
  }

  setLocation(data: models.Location) {
    this.location = data;
    this.delivery && this._io.emit(models.ioEvents.location_changed, { delivery_id: this.delivery?.delivery_id, location: data });
  }

  fetchDelivery() {
    if (this.v.valid) {
      this.searching = true;
      this.delivery = null;
      this._ds.get(this.v.value.delivery_id as string).then(res => {
        if (res?.delivery_id) {
          res['end_time'] = moment(res.end_time).format('LLL');
          res['start_time'] = moment(res.start_time).format('LLL');
          res['pickup_time'] = moment(res.pickup_time).format('LLL');
          this.delivery = res;
          this.markers = [res.package.from_location, res.package.to_location];
        } else {
          this._ui.openSnackBar(`Delivery not found`);
        }
        this.searching = false;
      });
    }
  }

  updateDelivery(data: Partial<models.Delivery>) {
    if (data.status) this.searching = true;
    this._ds.update(this.v.value.delivery_id as string, {
      status: (data.status || this.delivery?.status) as models.DeliveryStatus,
      location: this.location,
    }).then(res => {
      if (res && (res as any).delivery_id) {
        res = res as models.Delivery;
        res['end_time'] = moment(res.end_time).format('LLL');
        res['start_time'] = moment(res.start_time).format('LLL');
        res['pickup_time'] = moment(res.pickup_time).format('LLL');
        this.delivery = res;
        this._io.emit(models.ioEvents.status_changed, { delivery_id: this.delivery?.delivery_id, status: data.status });
        data.status && this._ui.openSnackBar(`Delivery updated`);
      } else {
        this._ui.openSnackBar(`Delivery not found`);
      }
      this.searching = false;
    });
  }

  updateStatus(status: string) {
    this.updateDelivery({ status: status as models.DeliveryStatus });
  }
}
