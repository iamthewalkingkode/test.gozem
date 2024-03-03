import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MapComponent } from '../map/map.component';
import { Location } from '../../../utils/models';
import { PackageService } from '../../services/package.service';
import { models } from '../../../utils';
import { UiService } from '../../services/ui.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-form-package',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MapComponent,
    MatProgressBarModule,
  ],
  templateUrl: './form-package.component.html',
  styleUrl: './form-package.component.scss'
})
export class FormPackageComponent {

  @ViewChild('stepper') stepper!: MatStepper;

  v = {
    description: this._fb.group({
      description: ['', [Validators.required]],
    }),
    package: this._fb.group({
      weight: ['', [Validators.required]],
      width: ['', [Validators.required]],
      height: ['', [Validators.required]],
      depth: ['', [Validators.required]],
    }),
    from: this._fb.group({
      from_name: ['', [Validators.required]],
      from_address: ['', [Validators.required]],
    }),
    to: this._fb.group({
      to_address: ['', [Validators.required]],
      to_name: ['', [Validators.required]],
    }),
  };

  location = {
    to_location: {} as models.Location,
    from_location: {} as models.Location,
  };

  submitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormPackageComponent>,
    private _fb: FormBuilder,
    private _ps: PackageService,
    private _ui: UiService,
  ) {

  }

  ngOnInit() {

  }

  setLocation(data: models.Location, key: 'to_location' | 'from_location') {
    this.location[key] = data;
  }

  submit() {
    if (this.v.to.value.to_name && this.v.to.value.to_address) {
      this.submitting = true;
      this._ps.create({
        ...this.v.description.value as any,
        ...this.v.package.value,
        ...this.v.from.value,
        ...this.v.to.value,
        ...this.location,
      }).then(res => {
        if (res) {
          this._ui.openSnackBar(`Package created`);
          this.dialogRef.close({ m: 'post', data: res });
        }
        this.submitting = false;
      });
    }
  }

}

