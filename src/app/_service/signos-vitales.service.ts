import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignosVitales } from '../_model/signos-vitales';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService extends GenericService<SignosVitales>{

  private signosCambio: Subject<SignosVitales[]> = new Subject<SignosVitales[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  //private url: string = `${environment.HOST}/pacientes`;  //ES6  Template Strings ``
  //constructor(private http: HttpClient) { }

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signovital`);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignosVitalesCambio() {
    return this.signosCambio.asObservable();
  }

  setSignosVitalescambio(lista: SignosVitales[]) {
    this.signosCambio.next(lista);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }
}
