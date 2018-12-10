import {Injectable} from '@angular/core';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UIService} from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UIService) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChange.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.uiService.loadingStateChange.next(false);
        console.log(result);
      })
      .catch(error => {
        this.uiService.loadingStateChange.next(false);
        console.log(error);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
    /*this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };*/
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChange.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.uiService.loadingStateChange.next(false);
        console.log(result);
      })
      .catch(error => {
        this.uiService.loadingStateChange.next(false);
        console.log(error);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
    /*this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };*/
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
