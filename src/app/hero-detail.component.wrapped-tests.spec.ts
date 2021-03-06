///// Boiler Plate ////
import {bind, Component, Directive, EventEmitter, FORM_DIRECTIVES, View} from 'angular2/angular2';

// Angular 2 Test Bed
import {
  beforeEachBindings, By, DebugElement, RootTestComponent as RTC,
  beforeEach, ddescribe, xdescribe, describe, expect, iit, it, xit // Jasmine wrappers
} from 'angular2/test';

import {injectAsync, injectTcb} from '../test-helpers/test-helpers';

///// Testing this component ////
import {HeroDetailComponent} from './hero-detail.component';
import {Hero} from './hero';

describe('HeroDetailComponent', () => {

  it('can be created', () => {
    let hc = new HeroDetailComponent()
    expect(hc instanceof HeroDetailComponent).toEqual(true); // proof of life
  });

  it('parent "currentHero" flows down to HeroDetailComponent', injectTcb( tcb => {
    return tcb
      .createAsync(TestWrapper)
      .then((rootTC:RTC) => {
        let hc:HeroDetailComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:TestWrapper = rootTC.componentInstance;

        rootTC.detectChanges(); // trigger view binding

        expect(hw.currentHero).toBe(hc.hero);
      });
  }));

  it('delete button should raise delete event for parent component', injectTcb( tcb => {

    return tcb
      //.overrideTemplate(HeroDetailComponent, '<button (click)="onDelete()" [disabled]="!hero">Delete</button>')
      .overrideDirective(TestWrapper, HeroDetailComponent, mockHDC)
      .createAsync(TestWrapper)
      .then((rootTC:RTC) => {

        let hw:TestWrapper = rootTC.componentInstance;
        let hdcElement = rootTC.componentViewChildren[0];
        let hdc:HeroDetailComponent = hdcElement.componentInstance;

        rootTC.detectChanges(); // trigger view binding

        // We can watch the HeroComponent.delete EventEmitter's event
        let subscription = hdc.delete.toRx().subscribe(() => {
          console.log('HeroComponent.delete event raised');
          subscription.dispose();
        });

        // We can EITHER invoke HeroComponent delete button handler OR
        // trigger the 'click' event on the delete HeroComponent button
        // BUT DON'T DO BOTH

        // Trigger event
        // FRAGILE because assumes precise knowledge of HeroComponent template
        hdcElement
          .query(By.css('#delete'))
          .triggerEventHandler('click', {});

        hw.testCallback = () => {
          // if wrapper.onDelete is called, HeroComponent.delete event must have been raised
          //console.log('HeroWrapper.onDelete called');
          expect(true).toEqual(true);
        }
        // hc.onDelete();
      });
  }), 500); // needs some time for event to complete; 100ms is not long enough

  it('update button should modify hero', injectTcb( tcb => {

     return tcb
      .createAsync(TestWrapper)
      .then((rootTC:RTC) => {

        let hc:HeroDetailComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:TestWrapper = rootTC.componentInstance;
        let origNameLength = hw.currentHero.name.length;

        rootTC.detectChanges(); // trigger view binding

        // We can EITHER invoke HeroComponent update button handler OR
        // trigger the 'click' event on the HeroComponent update button
        // BUT DON'T DO BOTH

        // Trigger event
        // FRAGILE because assumes precise knowledge of HeroComponent template
        rootTC.componentViewChildren[0]
          .componentViewChildren[2]
          .triggerEventHandler('click', {});

        // hc.onUpdate(); // Invoke button handler
        expect(hw.currentHero.name.length).toBeGreaterThan(origNameLength);
      });
  }));

});

///// Test Components ////////

// TestWrapper is a convenient way to communicate w/ HeroDetailComponent in a test
@Component({selector: 'hero-wrapper'})
@View({
  template: `<my-hero-detail [hero]="currentHero" [user-name]="userName" (delete)="onDelete()"></my-hero-detail>`,
  directives: [HeroDetailComponent]
})
class TestWrapper {
  currentHero = new Hero('Cat Woman', 42);
  userName = 'Sally';
  testCallback() {} // monkey-punched in a test
  onDelete() { this.testCallback(); }
}

@View({
  template: `
    <div>
      <h2>{{hero.name}} | {{userName}}</h2>
      <button id="delete" (click)="onDelete()" [disabled]="!hero">Delete</button>
      <button id="update" (click)="onUpdate()" [disabled]="!hero">Update</button>
      <div id="id">{{hero.id}}</div>
      <input [(ng-model)]="hero.name"/>
    </div>`,
  directives: [FORM_DIRECTIVES]
})
class mockHDC //extends HeroDetailComponent { }
{
    hero: Hero;

  delete = new EventEmitter();

  onDelete() { this.delete.next(this.hero) }

  onUpdate() {
    if (this.hero) {
      this.hero.name += 'x';
    }
  }
  userName: string;
}