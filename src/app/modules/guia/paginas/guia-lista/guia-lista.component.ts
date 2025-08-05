import { Component, inject, OnInit, signal } from '@angular/core';
import { Guia } from '../../interfaces/guia.interface';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { GuiaRepository } from '../../repository/guia.repository';
import { columnasGuiaLista } from '../../mapeo/guia-lista.mapeo';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guia-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent],
  templateUrl: './guia-lista.component.html',
  styleUrl: './guia-lista.component.scss',
})
export default class GuiaListaComponent implements OnInit {
  private arrGuiasSeleccionadas = signal<Guia[]>([]);
  private _guiaRepository = inject(GuiaRepository);

  public columnas = columnasGuiaLista;
  public arrGuiasSignal = signal<Guia[]>([]);

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._guiaRepository.lista().subscribe(respuesta => {
      const guias = respuesta.results.map((guia: Guia) => {
        return {
          ...guia,
          total: guia.flete + guia.manejo,
        };
      });
      this.arrGuiasSignal.set(guias);
    });
  }

  onSeleccionGuias(vehiculos: Guia[]) {
    this.arrGuiasSeleccionadas.set(vehiculos);
  }

  eliminar() {
    const eliminaciones$ = this.arrGuiasSeleccionadas().map(guia =>
      this._guiaRepository.eliminar(guia.id)
    );

    forkJoin(eliminaciones$).subscribe({
      next: () => {
        this.consultarInformacion();
        this.arrGuiasSeleccionadas.set([]);
      },
      error: err => {
        console.error('Error al eliminar guia:', err);
      },
    });
  }
}
