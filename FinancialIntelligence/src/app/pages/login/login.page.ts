import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; 
  
  constructor(private router: Router) {}

  // Function to validate email format
  isEmailValid(): boolean {
    const emailPattern = /^[^s@]+@[^s@]+.[^s@]+$/;
    return emailPattern.test(this.email);
  }

  onSubmit() {
    if (this.isEmailValid()) {
      // Proceed with login logic
      console.log('Email and password are valid.');
    } else {
      console.log('Invalid email format.');
    }
    // Navigate to home page after successful login (for example)
    this.router.navigate(['/home']);
  }

  // if (this.password === this.confirmPassword) {
  //   // Handle signup logic here
  //   console.log('Signup successful:', this.email);
  //   // Navigate to another page or show success message
  //   this.router.navigate(['/home']);
  // } else {
  //   console.error('Passwords do not match!');
  //   // Show an error message
  // }

}
