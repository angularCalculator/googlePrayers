import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  
  user$: Observable<firebase.User>; 
  calendarItems: any[];
  IP: any;
  prayerData: any;

  constructor(public afAuth: AngularFireAuth, private http: HttpClient) { 
    this.initClient();
    this.user$ = afAuth.authState;
    this.getTextIP();
  }

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client')

      // It's OK to expose these credentials, they are client safe.
      gapi.client.init({
        apiKey: 'AIzaSyAbDgY2uRP5yYEBdiwHjbX2QW6UweMABMY',
        clientId: '761721867628-ru0nib25vauf7q0h5v55el68vjt43lk6.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

    });
  }

  getTextIP(): void {
    this.getIp().subscribe(
      res => {
        this.IP = res;
      },
      err => {
        this.IP = err;
      }
    );
}

  getIp(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>('https://api.ipify.org/?format=json', { headers });
}

getTextPrayerData(): void {
  this.initPrayerData().subscribe(
    res => {
      console.log(res)
      this.prayerData = res;
    },
    err => {
      this.IP = err;
    }
  );
}

initPrayerData(): Observable<any>  {
  const headers = this.getHeaders();
  console.log(this.IP.ip)
  // const url = 'https://www.islamicfinder.us/index.php/api/prayer_times?latitude=49.2833&longitude=123.1298&timezone=America/Vancouver'
  // const url = 'https://www.islamicfinder.us/index.php/api/prayer_times?user_ip='+this.IP.ip
   const url = 'https://api.aladhan.com/v1/calendarByCity?city=Vancouver&country=Canada'
  // const url = 'https://muslimsalat.com/vancouver.json?key=9de87a0077bb362fbc85c0251e7b496d'
  return this.http.get<any>(url, { headers });
}

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    console.log(googleUser)

    const credential = auth.GoogleAuthProvider.credential(token);

    await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);


    // Alternative approach, use the Firebase login with scopes and make RESTful API calls

    // const provider = new auth.GoogleAuthProvider()
    // provider.addScope('https://www.googleapis.com/auth/calendar');

    // this.afAuth.auth.signInWithPopup(provider)
    
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  async getCalendar() {
    const data = this.getTextPrayerData(); // 
    console.log(this.prayerData) // 
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })

    console.log(events)

    this.calendarItems = events.result.items;
  
  }

  async insertEvent() {
    const data = this.getTextPrayerData(); // 
    console.log(this.prayerData) // 
    const insert = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      reminders: {
        overrides: [
          {
            method: 'popup',
            minutes: 30
          },
        ],
        useDefault: false
      },
      start: {
        dateTime: hoursFromNow(1),
        timeZone: 'America/Vancouver'
      }, 
      end: {
        dateTime: hoursFromNow(1.5),
        timeZone: 'America/Vancouver'
      }, 
      summary: 'Have you prayed Asr?',
      description: 'Have you prayed Asr yet? It\'s Maghrib time.'
    })

    await this.getCalendar();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
    });
}


}

const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();
