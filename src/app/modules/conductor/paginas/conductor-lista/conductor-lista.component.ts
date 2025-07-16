import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { ConductorRepository } from '../../repository/conductor.repository';
import { columnasConductorLista } from '../../constants/conductor.mapeo';

@Component({
  selector: 'app-conductor-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent],
  templateUrl: './conductor-lista.component.html',
  styleUrl: './conductor-lista.component.scss',
})
export default class ConductorListaComponent implements OnInit {
  private _conductorRepository = inject(ConductorRepository);

  columnas = columnasConductorLista;

  arrConductores = this._conductorRepository.arrConductorsSignal;
  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._conductorRepository.lista().subscribe();
  }

  onSeleccionConductores(data: any) {
    console.log(data);
  }
}
