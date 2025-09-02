import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ViajeRepository } from '../../repositories/viaje.repository';
import { RouterLink } from '@angular/router';
import { Viaje } from '../../interfaces/viaje.interface';
import { CommonModule } from '@angular/common';
import { AlertaService } from '@app/common/services/alerta.service';
import { ViajeCardComponent } from '../../components/viaje-card/viaje-card.component';
import { Store } from '@ngrx/store';
import { Contenedor } from '@app/modules/contenedor/interfaces/contenedor.interface';
import { obtenerContenedor } from '@app/modules/contenedor/store/selectors/contenedor.selectors';

@Component({
  selector: 'app-viaje-lista',
  standalone: true,
  imports: [RouterLink, CommonModule, ViajeCardComponent],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViajeComponent implements OnInit {
  private _viajeRepository = inject(ViajeRepository);
  private _alertaService = inject(AlertaService);
  private _store = inject(Store);
  private _contenedor: Contenedor | null = null;

  public viajes = signal<Viaje[]>([]);

  ngOnInit(): void {
    this.getVisitas();
    this._loadContenedorData();
  }

  private _loadContenedorData() {
    this._store.select(obtenerContenedor).subscribe(contenedor => {
      this._contenedor = contenedor;
    });
  }

  getVisitas() {
    this._viajeRepository
      .getViajes({
        serializador: 'lista',
        solicitud_cliente: 'True',
        estado_aceptado: 'False',
        estado_cancelado: 'False',
      })
      .subscribe(response => {
        this.viajes.set(response.viajes);
      });
  }

  agregarPropuesta(viajeId: number, precio: number) {
    this._viajeRepository
      .agregarPropuesta({
        viaje_id: viajeId,
        precio: precio,
        contendor_id: this._contenedor?.contenedor_id,
        empresa: this._contenedor?.nombre,
      })
      .subscribe(() => {
        this.getVisitas();
        this._alertaService.mostrarExito('Propuesta agregada correctamente');
      });
  }
}
