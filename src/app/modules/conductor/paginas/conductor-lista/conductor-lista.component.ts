import { Conductor } from './../../interfaces/conductor.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { ConductorRepository } from '../../repository/conductor.repository';
import { columnasConductorLista } from '../../mapeo/conductor-lista.mapeo';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-conductor-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent],
  templateUrl: './conductor-lista.component.html',
  styleUrl: './conductor-lista.component.scss',
})
export default class ConductorListaComponent implements OnInit {
  private _conductorRepository = inject(ConductorRepository);
  private arrConductoresSeleccionados = signal<Conductor[]>([]);
  public arrConductores = signal<Conductor[]>([]);
  columnas = columnasConductorLista;

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._conductorRepository
      .lista()
      .subscribe(respuesta => this.arrConductores.set(respuesta.results));
  }

  onSeleccionConductores(conductor: Conductor[]) {
    this.arrConductoresSeleccionados.set(conductor);
  }

  eliminar() {
    const eliminaciones$ = this.arrConductoresSeleccionados().map(conductor =>
      this._conductorRepository.eliminar(conductor.id)
    );

    forkJoin(eliminaciones$).subscribe({
      next: () => {
        this.consultarInformacion();
        this.arrConductoresSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar conductor:', err);
      },
    });
  }
}
