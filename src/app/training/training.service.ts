import {Injectable} from '@angular/core';
import {Exercise, PreExercise} from './exercise.model';
import {Subject} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private availableExercises: Exercise[] = [
    // {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    // {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    // {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    // {id: 'burpees', name: 'Burpees', duration: 60, calories: 8}
  ];

  exerciseChange = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private runningExercise: Exercise;
  // private finishedExercises: Exercise[] = [];

  private exercisesCollection: AngularFirestoreCollection<PreExercise>;

  constructor(private readonly db: AngularFirestore) {
  }

  fetchAvailableExersices() {
    //return this.availableExercises.slice();
    this.exercisesCollection = this.db.collection<PreExercise>('availableExercises');
    this.exercisesCollection.snapshotChanges().pipe(
      map(docArray => docArray.map(doc => {
        const data = doc.payload.doc.data() as PreExercise;
        const id = doc.payload.doc.id;
        return {id, ...data};
      }))
    ).subscribe((exercises: Exercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    });
   /* this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data(). .name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      }).subscribe((finishedExercises: Exercise[]) => {
        this.availableExercises = finishedExercises;
        this.exercisesChanged.next([...this.availableExercises]);
    });*/
  }

  startExercise(selectedId: string) {
   // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});  Es solo un ejemplo de trabajo con Documentos
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChange.next({...this.runningExercise});
  }

  completExercise() {
    this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChange.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChange.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercise() {
    //return this.finishedExercises.slice();
    this.db.collection<Exercise>('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
