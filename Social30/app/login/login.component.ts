import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
	moduleId: module.id,
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	signUpForm: FormGroup;    
	loading = false;
	submitted = false;
	returnUrl: string;
	
	constructor(
		private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
		//private alertService: AlertService
		) {	}

	ngOnInit() {
		this.signUpForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
		
		// reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '../home';
	 }

	get f() { return this.signUpForm.controls; }

	 onSubmit() {
		this.submitted = true;

		 // stop here if form is invalid
		 if (this.signUpForm.invalid) {
            return;
		}

		this.loading = true;
		// this.router.navigate([this.returnUrl]); // placeholder
		this.authenticationService.login(this.f.email.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					console.log('Login failed - Richards fault.')
					this.loading = false;
				});
	 }
}