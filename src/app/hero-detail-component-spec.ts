///// Boiler Plate ////
import {bind, Component, Directive, EventEmitter, FORM_DIRECTIVES, View} from 'angular2/angular2';

import {
beforeEachBindings, By, DebugElement, /*dispatchEvent,*/ RootTestComponent as RTC,
// Jasmine overrides
beforeEach, ddescribe, xdescribe, describe, iit, it, xit //expect,
} from 'angular2/test';

import {dispatchEvent, injectAsync, injectTcb, tick} from 'test-helpers/test-helpers';

///// Testing this component ////
import {HeroDetailComponent} from './hero-detail-component';
import {Hero} from './hero';

describe('HeroDetailComponent', () => {

  /////////// Component Tests without DOM interaction /////////////
  describe('(No DOM)', () => {
    it('can be created', () => {
      let hdc = new HeroDetailComponent();
      expect(hdc instanceof HeroDetailComponent).toEqual(true); // proof of life
    });

    it('onDelete method should raise delete event', injectAsync(done => {
      let hdc = new HeroDetailComponent();

      // Listen for the HeroComponent.delete EventEmitter's event
      hdc.delete.toRx().subscribe(() => {
        console.log('HeroComponent.delete event raised');
        done();  // it must have worked
      });

      hdc.onDelete();
    }));

    it('onUpdate method should modify hero', () => {
      let hdc = new HeroDetailComponent();
      hdc.hero = new Hero('Cat Woman', 42);
      let origNameLength = hdc.hero.name.length;

      hdc.onUpdate();
      expect(hdc.hero.name.length).toBeGreaterThan(origNameLength);
    });
  });


  /////////// Component tests that check the DOM /////////////
  describe('(DOM)', () => {

    it('Delete button should raise delete event', injectTcb((tcb, done) => {

      // We only care about the button
      let template = '<button (click)="onDelete()">Delete</button>';

      tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rootTC: RTC) => {
          let hdc: HeroDetailComponent = rootTC.componentInstance;

          // Listen for the HeroComponent.delete EventEmitter's event
          hdc.delete.toRx().subscribe(() => {
            console.log('HeroComponent.delete event raised');
            done(); // it must have worked
          });

          // trigger the 'click' event on the HeroDetailComponent delete button
          rootTC.query(By.css('button')).triggerEventHandler('click');
        });

    }));

    it('Update button should modify hero', injectTcb((tcb, done) => {

      let template =
        `<div>
          <button id="update" (click)="onUpdate()" [disabled]="!hero">Update</button>
          <input [(ng-model)]="hero.name"/>
        </div>`

      tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rootTC: RTC) => {

          let hdc: HeroDetailComponent = rootTC.componentInstance;
          hdc.hero = new Hero('Cat Woman', 42);
          let origNameLength = hdc.hero.name.length;

          // trigger the 'click' event on the HeroDetailComponent update button
          rootTC.query(By.css('#update')).triggerEventHandler('click');

          expect(hdc.hero.name.length).toBeGreaterThan(origNameLength);
          done();
        });
    }));

    it('Entering hero name in textbox changes hero', injectTcb((tcb, done) => {

      let hdc: HeroDetailComponent
      let template = `<input [(ng-model)]="hero.name"/>`

      tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rootTC: RTC) => {

          hdc = rootTC.componentInstance;

          hdc.hero = new Hero('Cat Woman');
          rootTC.detectChanges();

          // get the HTML element and change its value in the DOM
          var input = rootTC.query(By.css('input')).nativeElement;
          input.value = "Dog Man"
          dispatchEvent(input, 'change'); // event triggers Ng to update model

          rootTC.detectChanges();
          // model update hasn't happened yet, despite `detectChanges`
          expect(hdc.hero.name).toEqual('Cat Woman');

        })
        .then(tick) // must wait a tick for the model update
        .then(() => {
          expect(hdc.hero.name).toEqual('Dog Man');
          done();
        })
    }));

    // Simulates ...
    // 1. change a hero
    // 2. select a different hero
    // 3  re-select the first hero
    // 4. confirm that the change is preserved in HTML
    // Reveals 2-way binding bug in alpha-36, fixed in pull #3715 for alpha-37

    it('toggling heroes after modifying name preserves the change on screen', injectTcb((tcb, done) => {

      let hdc: HeroDetailComponent;
      let hero1 = new Hero('Cat Woman', 1);
      let hero2 = new Hero('Goat Boy', 2);
      let input: HTMLInputElement;
      let rootTC: RTC;
      let template = `{{hero.id}} - <input [(ng-model)]="hero.name"/>`

      tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rtc: RTC) => {
          rootTC = rtc;
          hdc = rootTC.componentInstance;

          hdc.hero = hero1; // start with hero1
          rootTC.detectChanges();

          // get the HTML element and change its value in the DOM
          input = rootTC.query(By.css('input')).nativeElement;
          input.value = "Dog Man"
          dispatchEvent(input, 'change'); // event triggers Ng to update model
        })
        .then(tick) // must wait a tick for the model update
        .then(() => {
          expect(hdc.hero.name).toEqual('Dog Man');

          hdc.hero = hero2 // switch to hero2
          rootTC.detectChanges();

          hdc.hero = hero1  // switch back to hero1
          rootTC.detectChanges();

          // model value will be the same changed value (of course)
          expect(hdc.hero.name).toEqual('Dog Man');

          // the view should reflect the same changed value
          expect(input.value).toEqual('Dog Man'); // fails in alpha36; should be fixed in alpha37

          done();
        })
    }));
  });
});
