import {Component, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import 'rxjs-compat/add/operator/map';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  // @Output() trainingStart = new EventEmitter<void>();
  // exercises: Exercise[];
  exercises: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService, private db: AngularFirestore) {
  }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExersices();
    // this.exercises = this.db.collection('availableExercises').valueChanges();
    this.exercises = this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      });
    //   .subscribe(result => {
    //   console.log(result);
    //   //for (const res of result) {
    //     // console.log(res.payload.doc.data());
    //   //}
    // });
    // this.db.collection('availableExercises').valueChanges().subscribe(result => {
    //   console.log(result);
    // });
  }


  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

}
