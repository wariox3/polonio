import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// estado-badge.component.ts
export type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple' | 'orange';

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge px-3 py-1 rounded-lg text-xs font-medium" [ngClass]="colorClasses">
      {{ etiqueta }}
    </span>
  `,
})
export class EstadoBadgeComponent {
  @Input() color: BadgeColor = 'gray';
  @Input() etiqueta: string = '';

  get colorClasses(): string {
    const colorMap: Record<BadgeColor, string> = {
      green: 'bg-green-200 text-green-900',
      red: 'bg-red-200 text-red-900',
      yellow: 'bg-yellow-200 text-yellow-900',
      blue: 'bg-blue-200 text-blue-900',
      gray: 'bg-gray-200 text-gray-900',
      purple: 'bg-purple-200 text-purple-900',
      orange: 'bg-orange-200 text-orange-900',
    };

    return colorMap[this.color] || colorMap.gray;
  }
}
