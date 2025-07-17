import { Component, inject, OnInit, signal } from '@angular/core';
import { Guia } from '../../interfaces/guia.interface';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { GuiaRepository } from '../../repository/guia.repository';
import { columnasGuiaLista } from '../../mapeo/guia-lista.mapeo';

@Component({
  selector: 'app-guia-lista',
  standalone: true,
  imports: [TablaComponent],
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
    this._guiaRepository.lista().subscribe(respuesta => this.arrGuiasSignal.set(respuesta.results));
  }

  onSeleccionGuias(vehiculos: Guia[]) {
    this.arrGuiasSeleccionadas.set(vehiculos);
  }

  eliminar() {
    this.arrGuiasSeleccionadas().map(vehiculo =>
      this._guiaRepository.eliminar(vehiculo.id).subscribe()
    );
    this.consultarInformacion();
    this.arrGuiasSeleccionadas.set([]);
  }
}
