import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente: Paciente;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private matSnackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.paciente = { ...this.data }
  }

  operar() {
    //REGISTRAR
    this.pacienteService.registrar(this.paciente).subscribe(() => {
      this.pacienteService.listar().subscribe(data => {
        this.pacienteService.setPacientecambio(data);
        this.matSnackBar.open('SE CREO UN NUEVO PACIENTE', 'OK', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.cerrar();
      });
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
