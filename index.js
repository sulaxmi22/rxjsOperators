import { RxHR } from '@akanass/rx-http-request';
import { catchError, map, of, concat, merge } from 'rxjs';
let start = Date.now();

// this api has 1000+ entries : Execution time is more
const data1 = RxHR.get('https://api.publicapis.org/entries', {json: true}).pipe(
  map(res => res.body.entries.filter(item => item.Category === 'Animals')),
  catchError(err => {
    return of({ error: true, message: err.message })
}));

// this api has only 1 entry : Execution time is less
const data2 = RxHR.get('https://api.publicapis.org/random', {json: true}).pipe(
  map(res => res.body.entries),
  catchError(err => {
    return of({ error: true, message: err.message })
}));

//const finalData = concat(data1, data2)  // data1: executed first - In sequential manner
const finalData = merge(data1, data2)   // data2: executed first - In asynchronous manner
  .subscribe(result => console.log(result));
  
let millis = Date.now() - start;
console.log(`seconds elapsed for  = ${(millis / 1000)}`);