import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private authService: AuthService) { }

  getMenu() {
    return [
      {
        title: "Inicio",
        icon: "home-outline",
        link: "/home"
      },
      {
        title: 'Inventario',
        icon: 'file-text-outline',
        children: [
          {
            title: 'Ver productos',
            link: '/products/view-products'
          },
          {
            title: 'Agregar producto',
            link: '/products/add-product'
          },
          {
            title: "Modificar cantidades de stock",
            link: '/products/add-stock'
          }
        ]
      },
      {
        title: 'Ventas',
        icon: 'shopping-cart-outline',
        children: [
          {
            title: 'Ver ventas',
            link: '/sales/view-sales'
          },
          {
            title: 'Agregar venta',
            link: '/sales/add-sale'
          },
          {
            title: 'Proforma',
            link: '/sales/pre-order',
            hidden: !this.authService.getRoles().includes('Admin')
          }
        ]
      },
      {
        title: 'Pedidos',
        icon: 'calendar-outline',
        hidden: !this.authService.getRoles().includes('Admin'),
        children: [
          {
            title: 'Agregar Pedido',
            link: '/orders/add-order'
          },
          {
            title: 'Ver Pedidos',
            link: '/orders/view-order'
          },
        ]
      },
      {
        title: 'Reportes',
        icon: 'clipboard-outline',
        children: [
          {
            title: 'Ventas del día',
            link: '/reports/sales-by-day',
            hidden: !this.authService.getRoles().includes('Admin')
          },
          {
            title: 'Registros de ventas',
            link: '/reports/sales-report'
          },
          {
            title: 'Ventas Detalladas',
            link: '/reports/detailed-sales-report',
            hidden: !this.authService.getRoles().includes('Admin')
          },
          {
            title: 'Productos mas vendidos',
            link: '/reports/product-report',
            hidden: !this.authService.getRoles().includes('Admin')
          },
          {
            title: 'Ventas por vendedor',
            link: '/reports/sales-by-seller-report',
            hidden: !this.authService.getRoles().includes('Admin')
          },
          {
            title: 'Ventas vs Gastos',
            link: '/reports/sales-vs-expenses-global-report',
          },
          {
            title: 'Kardex de producto',
            link: '/reports/product-kardex-report'
          },
          {
            title: 'Kardex de cliente',
            link: '/reports/client-kardex-report',
            hidden: !this.authService.getRoles().includes('Admin')
          },
          {
            title: 'Inventario físico',
            link: '/reports/physical-inventory-report'
          },
          {
            title: 'Ingresos de mercadería',
            link: '/reports/merchandise-registers-report',
            hidden: !this.authService.getRoles().includes('Admin')
          },
          {
            title: 'Registros de cuenta',
            link: '/reports/entry-report'
          },
          {
            title: 'Registros de gastos',
            link: '/reports/expense-report'
          }
        ]
      }
    ];
  }
}
