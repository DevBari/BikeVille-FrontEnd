import { Component, NgModule } from '@angular/core';
import { AdminService } from '../../../../service/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor,NgIf } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  
  constructor(private adminService : AdminService,private notify: ToastrService) { }


  customers!: any;
  salesOrders!: any;
  showSalesOrders : boolean = false
  
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  

  loadCustomers() {
    return this.adminService.getCustomers().subscribe((data: any) => {
      this.customers = data.$values.map((customer: any) => ({
        customerId: customer.customerId,
        userId: customer.userID, // Assicurati che questa proprietà esista
        firstName: customer.firstName,
        lastName: customer.lastName,
        companyName: customer.companyName,
        salesPerson: customer.salesPerson
      }));
    }, error => {
      console.error(error);
      this.notify.error('Error loading customers');
    });
  }

  deleteCustomer(id : number) {
    return this.adminService.deleteCustomerById(id).subscribe((data: any) => {
      console.log(data);
      this.notify.success('Customer deleted');
      this.loadCustomers(); // Ricarica la lista dei clienti
    }, error => {
      console.error(error);
      this.notify.error('Error deleting customer');
    });
  }


  getCustomerSalesOrders(id:number){
    this.adminService.getCustomerById(id).subscribe((data: any) => {
      console.log(data.salesOrderHeaders.$values);
      this.salesOrders = data.salesOrderHeaders.$values
    })
    this.showSalesOrders = true
  }
}

