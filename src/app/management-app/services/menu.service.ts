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
            title: 'Registros de ventas',
            link: '/reports/sales-report'
          }
        ]
      }
    ];
  }
}
