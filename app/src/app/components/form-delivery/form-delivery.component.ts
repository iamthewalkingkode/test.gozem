import { Component, Inject } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { models } from '../../../utils';
import { UiService } from '../../services/ui.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-form-delivery',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatProgressBarModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form-delivery.component.html',
  styleUrl: './form-delivery.component.scss'
})
export class FormDeliveryComponent {

  v = this._fb.group({
    package_id: ['', [Validators.required]],
  });
  submitting: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { packages: models.Package[] },

    public dialogRef: MatDialogRef<FormDeliveryComponent>,
    private _fb: FormBuilder,
    private _ds: DeliveryService,
    private _ui: UiService,
  ) {

  }

  ngOnInit() {

  }

  displayFn(option: models.Package) {
    return option && option.description ? option.description : '';
  }

  submit() {
    if (this.v.valid) {
      this.submitting = true;
      this._ds.create({
        package_id: (this.v.value.package_id as unknown as models.Package).package_id,
      }).then(res => {
        if (res && (res as any).delivery_id) {
          this._ui.openSnackBar(`Delirey created`);
          this.dialogRef.close({ m: 'post', data: res });
        } else {
          res && this._ui.openSnackBar((res as string[]).join(', '));
        }
        this.submitting = false;
      });
    }
  }
}
