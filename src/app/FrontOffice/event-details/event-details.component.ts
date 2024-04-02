import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvennementService } from '../../serives/eventsService/evennement.service';
import { GeocodingService } from '../../serives/eventsService/geocoding.service';
import { Patient } from '../models/Patient';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  eventId: any;
  eventDetails: any;
  placeName: string = '';
  errorMessage: string = '';
  userId: any;
  patient_Connecter!: Patient;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evennementService: EvennementService,
    private geocodingService: GeocodingService
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.userId = params['userId']; 
      this.loadEventDetails();
      const UserConnected_String = localStorage.getItem('Patient');
   const UserConnected = UserConnected_String ? JSON.parse(UserConnected_String) : null;
   this.patient_Connecter ={
    idpatient: UserConnected.idpatient,
    user: UserConnected.user,
    typePatient: UserConnected.typePatient,
    archiver: UserConnected.archiver,
    poid :UserConnected.poid,
    longueur:UserConnected.longueur,
    sexe:UserConnected.sexe,
    dateDeNaissance:UserConnected.dateDeNaissance

}
console.log("----- USER PATIENT------");
console.log(this.patient_Connecter);
    });
  }

  loadEventDetails() {
    this.evennementService.getEvennementById(this.eventId).subscribe(
      (res: any) => {
        this.eventDetails = res;
        this.getPlaceName(this.eventDetails.lat, this.eventDetails.lng);
        console.log(this.eventDetails.lat, this.eventDetails.lng)
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getPlaceName(latitude: number, longitude: number): void {
    this.geocodingService.getPlaceName(latitude, longitude).subscribe(
      (data: any) => {
        if (data && data.display_name) {
          this.placeName = data.display_name;
        } else {
          this.placeName = 'Nom de la place non disponible';
        }
      },
      err => {
        console.log('Erreur lors de la récupération du nom de la place:', err);
        this.placeName = 'Erreur lors de la récupération du nom de la place';
      }
    );
  }
  
  participer(): void {
    if (this.patient_Connecter.user && typeof this.patient_Connecter.user === 'number' && this.eventId && typeof this.eventId === 'number') {
      this.evennementService.registerUserToEvent(this.eventId, this.patient_Connecter.user).subscribe(
        (response: any) => {
          alert("Vous avez été inscrit avec succès à l'événement. Merci!");
          // Rediriger l'utilisateur vers une autre page ou recharger la page actuelle
          this.router.navigate(['/afficherevennementfront']);
        },
        (error: any) => {
          this.errorMessage = error.error;
        }
      );
    } else {
      console.log("UserId ou EventId est undefined ou n'est pas un nombre");
      // Gérer le cas où userId ou eventId est undefined ou n'est pas un nombre
    }
  }
  
}
