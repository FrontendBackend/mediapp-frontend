import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignosVitales } from 'src/app/_model/signos-vitales';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {

  form: FormGroup;

  id: number;

  pacientes$: Observable<Paciente[]>;

  idPacienteSeleccionado: number;

  edicion: boolean;

  maxFecha: Date = new Date();

  fechaSeleccionada: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosVitalesService: SignosVitalesService,
    private pacienteService: PacienteService,
  ) { }

  ngOnInit(): void {
    this.listarPacientes();

    this.form = new FormGroup({
      'id': new FormControl(0),
      // 'idPaciente': new FormControl(0),
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl(''),
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    })
  }

  initForm() {
    if (this.edicion) {


      this.signosVitalesService.listarPorId(this.id).subscribe(data => {
        // let fecha: Date | any;
        // this.fechaSeleccionada = fecha;

        this.idPacienteSeleccionado = data.paciente.idPaciente,
        this.fechaSeleccionada = data.fecha,
        this.form = new FormGroup({
          'id': new FormControl(data.idSignosVitales),
          // 'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmo': new FormControl(data.ritmo)
        });
      });
    }
  }

  operar(): void {

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let signosVitales = new SignosVitales();
    signosVitales.idSignosVitales = this.form.value['id'];

    signosVitales.paciente = paciente;

    signosVitales.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');

    signosVitales.temperatura = this.form.value['temperatura'];
    signosVitales.pulso = this.form.value['pulso'];
    signosVitales.ritmo = this.form.value['ritmo'];


    if (this.edicion) {
      //MODIFICAR
      this.signosVitalesService.modificar(signosVitales).subscribe(() => {
        // signosVitales.paciente.idPaciente = paciente.idPaciente;
        this.signosVitalesService.listar().subscribe(data => {
          this.signosVitalesService.setSignosVitalescambio(data);
          this.signosVitalesService.setMensajeCambio('SE MODIFICO');
        });
      });
    }
    else {
      //REGISTRAR

      this.signosVitalesService.registrar(signosVitales).subscribe(() => {
        this.signosVitalesService.listar().subscribe(data => {
          this.signosVitalesService.setSignosVitalescambio(data);
          this.signosVitalesService.setMensajeCambio('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['pages/signos']);
  }

  listarPacientes() {
    //this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.pacientes$ = this.pacienteService.listar();
  }

  estadoBotonRegistrar() {
    return (this.idPacienteSeleccionado === 0);
  }
  /*aceptar() {
    let signosVitales = new SignosVitales();
    signosVitales.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
  }*/
}
