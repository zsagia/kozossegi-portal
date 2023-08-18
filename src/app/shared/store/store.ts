import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

export class Store<T> {
  private state$$: BehaviorSubject<T>;

  readonly state$: Observable<T>;

  public constructor(initialstate: T) {
    this.state$$ = new BehaviorSubject<T>(initialstate);
    this.destroy$$ = new ReplaySubject<void>(1);
    this.state$ = this.state$$.asObservable();
  }

  protected get state(): T {
    return this.state$$.getValue();
  }

  protected getState$(): Observable<T> {
    return this.state$;
  }

  protected setState(value: T): void {
    this.state$$.next(value);
  }

  protected readonly destroy$$: Subject<void>;

}
