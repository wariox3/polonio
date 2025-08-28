import { Component, Input } from '@angular/core';
import { BadgeColor } from '../estado-badge/estado-badge.component';
import { CommonModule } from '@angular/common';
import { EstadoBadgeComponent } from '../estado-badge/estado-badge.component';
import { ConfiguracionBadge } from './estado-badges-container.interface';

@Component({
  selector: 'app-estado-badges-container',
  standalone: true,
  imports: [CommonModule, EstadoBadgeComponent],
  template: `
    <div class="flex flex-wrap gap-2">
      <ng-container *ngFor="let config of configuracionOrdenada">
        <app-estado-badge
          [color]="determinarColor(config, datos[config.clave])"
          [etiqueta]="config.etiqueta"
        >
        </app-estado-badge>
      </ng-container>
    </div>
  `,
})
export class EstadoBadgesContainerComponent {
  @Input() datos: any = {};
  @Input() configuracion: ConfiguracionBadge[] = [];
  @Input() ordenarPorEstado: boolean = false;
  @Input() trueAlFinal: boolean = false;

  get configuracionFiltrada(): ConfiguracionBadge[] {
    return this.configuracion.filter(config => {
      if (config.mostrar === undefined) return true;
      if (typeof config.mostrar === 'function') return config.mostrar(this.datos);
      return config.mostrar;
    });
  }

  get configuracionOrdenada(): ConfiguracionBadge[] {
    if (!this.ordenarPorEstado) {
      return this.configuracionFiltrada;
    }

    return [...this.configuracionFiltrada].sort((a, b) => {
      const valorA = Boolean(this.datos[a.clave]);
      const valorB = Boolean(this.datos[b.clave]);

      if (this.trueAlFinal) {
        // Si trueAlFinal es true, los valores true van al final
        return valorA === valorB ? 0 : valorA ? 1 : -1;
      } else {
        // Por defecto, los valores true van primero
        return valorA === valorB ? 0 : valorA ? -1 : 1;
      }
    });
  }

  determinarColor(config: ConfiguracionBadge, valor: any): BadgeColor {
    // Si hay un mapeo de colores específico
    if (config.colorMap) {
      // Convertir valor a string para usarlo como clave
      const valorStr = String(valor);
      // Usar el color mapeado o el default
      return config.colorMap[valorStr] || config.colorMap._default || 'gray';
    }

    // Para valores booleanos simples
    if (typeof valor === 'boolean') {
      return valor ? config.colorTrue || 'green' : config.colorFalse || 'gray';
    }

    // Valor por defecto
    return 'gray';
  }
}
