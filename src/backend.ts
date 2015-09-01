import {Http} from 'http/http';
import {Injectable} from 'angular2/angular2';
import {Hero} from 'hero';

@Injectable()
export class Backend {
	constructor(public http: Http) {
		this.http = http;
	}

	fetchAllHeroesAsync(): Promise<Hero[]> {

		var p = this.http.get('heroes.json')
			.toRx().map((response: any) => response.json()).toPromise();

		return addLatency(p, 1000);
	}

}
function addLatency(promise: Promise<Hero[]>, delay = 0): Promise<Hero[]> {
		return promise.then(heroes => {
			return new Promise<Hero[]>((resolve, reject) => {
				setTimeout(() => resolve(heroes), delay);
			});
		}, error => Promise.reject(error));
}
