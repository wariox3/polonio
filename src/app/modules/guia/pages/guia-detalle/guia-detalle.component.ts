import { Guia } from './../../interfaces/guia.interface';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { GuiaRepository } from '../../repositories/guia.repository';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { configuracionEstados, obtenerCamposGuiaDetalle } from '../../mapping/guia-detalle.mapeo';
import { EstadoBadgesContainerComponent } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.component';

@Component({
  selector: 'app-guia-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent, EstadoBadgesContainerComponent],
  templateUrl: './guia-detalle.component.html',
  styleUrl: './guia-detalle.component.scss',
})
export default class GuiaDetalleComponent implements OnInit {
  private _guiaRepository = inject(GuiaRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public guiaSignal = signal<Guia>({
    id: 0,
    fecha: '',
    destinatario: 0,
    ciudad_destino: 0,
    ciudad_destino__nombre: '',
    ciudad_origen: 0,
    ciudad_origen__nombre: '',
    cliente: 0,
    contacto: 0,
    contacto__nombre_corto: '',
    empaque: 0,
    servicio: 0,
    producto: 0,
    ruta: 0,
    zona: 0,
    operacion_cargo: 0,
    operacion_cargo__nombre: '',
    operacion_ingreso: 0,
    operacion_ingreso__nombre: '',
    unidades: 0,
    peso: 0,
    volumen: 0,
    peso_facturado: 0,
    declara: 0,
    flete: 0,
    manejo: 0,
    recaudo: 0,
    cobro_entrega: 0,
    contenido_verificado: false,
    mercancia_peligrosa: false,
    requiere_cita: false,
    comentario: undefined,
    documento: undefined,
    fecha_ingreso: undefined,
    despacho: undefined,
    estado_recogido: false,
    estado_ingreso: false,
    estado_embarcado: false,
    estado_despachado: false,
    estado_entregado: false,
    estado_soporte: false,
    estado_novedad: false,
    estado_novedad_solucionada: false,
    estado_rndc: false,
    liquidacion: 0,
    fecha_recogida: '',
    fecha_despacho: '',
    fecha_entrega: '',
    fecha_soporte: '',
    numero_rndc: '',
    remitente_nombre: '',
    destinatario_nombre: '',
    destinatario_direccion: '',
    destinatario_telefono: '',
    destinatario_correo: '',
    servicio__nombre: '',
    empaque__nombre: '',
    producto__nombre: '',
    ruta__nombre: '',
    zona__nombre: '',
    cliente__nombre_corto: '',
    destinatario__nombre_corto: '',
    destinatario__correo: '',
    destinatario__direccion: '',
    destinatario__telefono: '',
  });
  public configuracionEstados = configuracionEstados;
  public camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposGuiaDetalle();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }
  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._guiaRepository.detalle(param.id);
        }),
        tap(detalle => this.guiaSignal.set(detalle))
      )
      .subscribe();
  }
}
