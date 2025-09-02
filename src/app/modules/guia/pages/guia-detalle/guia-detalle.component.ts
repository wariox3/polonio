import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EstadoBadgesContainerComponent } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.component';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GuiaTabDespachoComponent } from '../../components/guia-tab-despacho/guia-tab-despacho.component';
import {
  configuracionEstados,
  obtenerCamposGuiaDetalle,
  obtenerCamposGuiaDetalleDestinatario,
} from '../../mapping/detalle/guia-detalle.mapeo';
import { GuiaRepository } from '../../repositories/guia.repository';
import { Guia } from './../../interfaces/guia.interface';

@Component({
  selector: 'app-guia-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TablaDetallesComponent,
    EstadoBadgesContainerComponent,
    GuiaTabDespachoComponent,
  ],
  templateUrl: './guia-detalle.component.html',
  styleUrl: './guia-detalle.component.scss',
})
export default class GuiaDetalleComponent implements OnInit {
  private _guiaRepository = inject(GuiaRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public activeTab: string = 'despacho';
  public guiaSignal = signal<Guia>({
    id: 0,
    fecha: '',
    destinatario: 0,
    destinatario__nombre_corto: '',
    destinatario__correo: '',
    destinatario__direccion: '',
    destinatario__telefono: '',
    ciudad_destino: 0,
    ciudad_destino__nombre: '',
    ciudad_origen: 0,
    ciudad_origen__nombre: '',
    cliente: 0,
    cliente__nombre_corto: '',
    contacto: 0,
    contacto__nombre_corto: '',
    empaque: 0,
    empaque__nombre: '',
    servicio: 0,
    servicio__nombre: '',
    producto: 0,
    producto__nombre: '',
    ruta: 0,
    ruta__nombre: '',
    zona: 0,
    zona__nombre: '',
    liquidacion: 0,
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
    comentario: '',
    documento: '',
    fecha_ingreso: '',
    despacho: 0,
    estado_recogido: false,
    estado_ingreso: false,
    estado_embarcado: false,
    estado_despachado: false,
    estado_entregado: false,
    estado_soporte: false,
    estado_novedad: false,
    estado_novedad_solucionada: false,
    estado_rndc: false,
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
    negocio: 0,
    negocio__nombre: '',
  });
  public configuracionEstados = configuracionEstados;
  public camposDetalleGuia = computed<CampoDetalle[]>(() => {
    return obtenerCamposGuiaDetalle();
  });
  public camposDetalleDestinatario = computed<CampoDetalle[]>(() => {
    return obtenerCamposGuiaDetalleDestinatario();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }
  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._guiaRepository.detalleExtendido(param.id);
        }),
        tap(detalle => this.guiaSignal.set(detalle.results[0]))
      )
      .subscribe();
  }
}
