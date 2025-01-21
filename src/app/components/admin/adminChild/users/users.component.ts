import { Component, NgModule } from '@angular/core';
import { AdminService } from '../../../../service/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor,NgIf } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor,NgIf, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  
  constructor(private adminService : AdminService,private notify: ToastrService) { }


  customers!: any[];
  salesOrders: any[] = [];
  showSalesOrders : boolean = false
  
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  

  loadCustomers() {
    return this.adminService.getCustomers().subscribe((data: any) => {
      if (data.$values && Array.isArray(data.$values)) {
        this.customers = data.$values.map((customer: any) => ({
          customerId: customer.customerId,
          userId: customer.userID, 
          firstName: customer.firstName,
          lastName: customer.lastName,
          companyName: customer.companyName,
          salesPerson: customer.salesPerson
        }));
      } else {
        this.customers = [];
        this.notify.error('Formato dati clienti non valido');
      }
    }, error => {
      console.error(error);
      this.notify.error('Errore nel caricamento dei clienti');
    });
  }

  deleteCustomer(id: number) {
    this.adminService.deleteCustomerById(id).subscribe({
      next: () => {
        this.notify.success('Cliente eliminato con successo');
        this.loadCustomers(); // Ricarica la lista dei clienti
      },
      error: (error) => {
        console.error(error);
        if (error.status === 400 && error.error.message) {
          this.notify.error(`Errore nell'eliminazione del cliente: ${error.error.message}`);
        } else if (error.status === 404 && error.error.message) {
          this.notify.error(`Errore: ${error.error.message}`);
        } else {
          this.notify.error('Errore nell\'eliminazione del cliente');
        }
      }
    });
  }

  getCustomerSalesOrders(id: number) {
    this.adminService.getCustomerById(id).subscribe({
      next: (data: any) => {
        console.log(data.salesOrderHeaders);
        // Verifica se salesOrderHeaders contiene $values
        if (data.salesOrderHeaders && data.salesOrderHeaders.$values && Array.isArray(data.salesOrderHeaders.$values)) {
          this.salesOrders = data.salesOrderHeaders.$values;
        } else if (Array.isArray(data.salesOrderHeaders)) {
          this.salesOrders = data.salesOrderHeaders;
        } else {
          this.salesOrders = [];
          this.notify.info('Nessun ordine associato a questo cliente.');
        }
        this.showSalesOrders = true;
      },
      error: (error) => {
        console.error(error);
        this.notify.error('Errore nel recupero degli ordini del cliente');
      }
    });
  }
}

