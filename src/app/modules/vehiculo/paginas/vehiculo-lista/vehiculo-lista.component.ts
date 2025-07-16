import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehiculoRepository } from '../../repository/vehiculo.repository';
import { columnasVehiculoLista } from '../../mapeo/vehiculo-lista.mapeo';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { Vehiculo } from '../../interfaces/vehiculo.interfeces';

@Component({
  selector: 'app-vehiculo-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent],
  templateUrl: './vehiculo-lista.component.html',
})
export default class VehiculoListaComponent implements OnInit {
  private _vehiculoService = inject(VehiculoRepository);

  arrVehiculos = this._vehiculoService.arrVehiculosSignal;
  columnas = columnasVehiculoLista;

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._vehiculoService.lista().subscribe();
  }

  eliminar() {}

  onSeleccionVehiculos(vehiculos: Vehiculo[]) {}
}
