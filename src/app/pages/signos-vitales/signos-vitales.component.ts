import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SignosVitales } from 'src/app/_model/signos-vitales';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<SignosVitales>;

  displayedColumns: string[] = ['idSignosVitales', 'nombres', 'fecha', 'temperatura', 'pulso', 'ritmo', 'acciones'];

  cantidad: number = 0;

  constructor(
    private signosVitalesService: SignosVitalesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      // console.log({'data': this.dataSource});

      this.dataSource.sort = this.sort;
    });

    this.signosVitalesService.getSignosVitalesCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosVitalesService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "right"
      });
    });
  }

  eliminar(id: number) {
    this.signosVitalesService.eliminar(id).subscribe(() => {
      this.signosVitalesService.listar().subscribe(data => {
        this.signosVitalesService.setSignosVitalescambio(data);
        this.signosVitalesService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  crearTabla(data: SignosVitales[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
    // this.dataSource.filteredData.filter = valor;
  }

  mostrarMas(e: any) {
    this.signosVitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
}
