import { Component, inject, OnInit, signal } from '@angular/core';
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
  private arrVehiculosEliminar = signal<Vehiculo[]>([]);
  arrVehiculos = this._vehiculoService.arrVehiculosSignal;
  columnas = columnasVehiculoLista;

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._vehiculoService.lista().subscribe();
  }

  onSeleccionVehiculos(vehiculos: Vehiculo[]) {
    this.arrVehiculosEliminar.set(vehiculos);
  }

  eliminar() {
    this.arrVehiculosEliminar().map(vehiculo =>
      this._vehiculoService.eliminar(vehiculo.id).subscribe()
    );
    this.consultarInformacion();
    this.arrVehiculosEliminar.set([]);
  }
}
