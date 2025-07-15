import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehiculoService } from '../../servicios/vehiculo.service';

@Component({
  selector: 'app-vehiculo-lista',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './vehiculo-lista.component.html',
})
export default class VehiculoListaComponent implements OnInit {
  private _vehiculoService = inject(VehiculoService);

  arrVehiculos = this._vehiculoService.arrVehiculosSignal;

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._vehiculoService.lista().subscribe();
  }

  eliminar() {}
}
