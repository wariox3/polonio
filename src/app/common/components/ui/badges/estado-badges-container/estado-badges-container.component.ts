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
      <ng-container *ngFor="let config of configuracionFiltrada">
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

  get configuracionFiltrada(): ConfiguracionBadge[] {
    return this.configuracion.filter(config => {
      if (config.mostrar === undefined) return true;
      if (typeof config.mostrar === 'function') return config.mostrar(this.datos);
      return config.mostrar;
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
