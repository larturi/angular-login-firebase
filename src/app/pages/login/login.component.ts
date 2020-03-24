import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme: boolean;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    this.recordarme = false;

    if (localStorage.getItem('email')) {
        this.usuario.email = localStorage.getItem('email');
        this.recordarme = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      icon: 'info',
      title: 'Autenticando',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login(this.usuario)
        .subscribe(resp => {

          if (this.recordarme) {
              localStorage.setItem('email', this.usuario.email);
          }

          console.log(resp);
          Swal.close();
          this.router.navigateByUrl('/home');

        }, (err => {
          console.log(err.error.error.message);
          Swal.fire({
            icon: 'error',
            title: 'No se ha podido autenticar ',
            text: err.error.error.message
          });
        }));

  }

}
