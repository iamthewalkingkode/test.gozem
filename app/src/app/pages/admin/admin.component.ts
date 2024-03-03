import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormPackageComponent } from '../../components/form-package/form-package.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { PackageService } from '../../services/package.service';
import { helpers, models } from '../../../utils';
import { DeliveryService } from '../../services/delivery.service';
import moment from 'moment';
import { FormDeliveryComponent } from '../../components/form-delivery/form-delivery.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {

  packages: models.Package[] = [];
  deliveries: models.Delivery[] = [];

  packagesColumns = ['package_id', 'from_name', 'from_address', 'to_name', 'to_address', 'description'];
  deliveriesColumns = ['delivery_id', 'package', 'status'];

  loading = true;

  constructor(
    private _ps: PackageService,
    private _ds: DeliveryService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this._ps.all(),
      this._ds.all(),
    ]).then(res => {
      if (res[0]) this.packages = res[0].data.map(row => {
        return {
          ...row,
          description: helpers.ucFirst(row.description),
          to_name: helpers.ucFirst(row.to_name),
          to_address: helpers.ucFirst(row.to_address),
          from_name: helpers.ucFirst(row.from_name),
          from_address: helpers.ucFirst(row.from_address),
        }
      });
      if (res[1]) this.deliveries = res[1].data.map(row => {
        return {
          ...row,
          package: {
            ...row.package,
            description: helpers.ucFirst(row.package.description),
          },
          start_time: moment(row.start_time).format('LLL'),
          pickup_time: moment(row.pickup_time).format('LLL'),
          end_time: moment(row.end_time).format('LLL'),
        }
      });
      this.loading = false;
      // this.deliveryFormOpen();
    });
  }

  packageFormOpen() {
    const dialogRef = this.dialog.open(FormPackageComponent, {
      width: '850px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const copyData: models.Package[] = helpers.copyObject(this.packages);
        if (res.m === 'post') {
          copyData.unshift(res.data);
          this.packages = copyData;
        } else {
          const i = copyData.indexOf(copyData.find(cd => cd.package_id === res.data.package_id) as models.Package);
          copyData[i] = res.data;
          this.packages = copyData;
        }
      }
    });
  }

  deliveryFormOpen() {
    const dialogRef = this.dialog.open(FormDeliveryComponent, {
      width: '450px',
      data: {
        packages: this.packages,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const copyData: models.Delivery[] = helpers.copyObject(this.deliveries);
        res.data['end_time'] = moment(res.data.end_time).format('LLL');
        res.data['start_time'] = moment(res.data.start_time).format('LLL');
        res.data['pickup_time'] = moment(res.data.pickup_time).format('LLL');
        if (res.m === 'post') {
          copyData.unshift(res.data);
          this.deliveries = copyData;
        } else {
          const i = copyData.indexOf(copyData.find(cd => cd.package_id === res.data.package_id) as models.Delivery);
          copyData[i] = res.data;
          this.deliveries = copyData;
        }
      }
    });
  }

}
