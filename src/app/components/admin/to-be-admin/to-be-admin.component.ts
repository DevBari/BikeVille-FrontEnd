import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-to-be-admin',
  standalone: true,
  imports: [],
  templateUrl: './to-be-admin.component.html',
  styleUrl: './to-be-admin.component.css'
})
export class ToBeAdminComponent {
  
  constructor(
    private route : ActivatedRoute,
    private adminService : AdminService,
  ) {}
  
  ngOnInit(): void {
    this.adminService.toBeAdmin(this.route.snapshot.params['email'])
    setTimeout(() => {
    window.location.replace('/');
  }, 3000);
  }
}

