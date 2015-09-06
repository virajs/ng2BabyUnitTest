import {
AsyncTestCompleter,
By,
DebugElement,
inject,
RootTestComponent,
TestComponentBuilder,
} from 'angular2/test';

import {DOM} from 'angular2/src/dom/dom_adapter';

export function injectAsync(testFn: (done: () => void) => void) {
  return inject([AsyncTestCompleter], function injectWrapper(async: AsyncTestCompleter) {
    testFn(async.done.bind(async));
  });
}
export function injectTcb(testFn: (tcb: TestComponentBuilder, done: () => void) => void) {
  return inject([TestComponentBuilder, AsyncTestCompleter], function injectWrapper(tcb: TestComponentBuilder, async: AsyncTestCompleter) {
    testFn(tcb, async.done.bind(async));
  });
}

export function getViewChildHtml(rootTC: RootTestComponent, elIndex: number = 0) {
  let child = rootTC.componentViewChildren[elIndex];
  return child && child.nativeElement && child.nativeElement.innerHTML
}

export function expectViewChildHtml(rootTC: RootTestComponent, elIndex: number = 0) {
  return expect(getViewChildHtml(rootTC, elIndex));
}

export function expectViewChildClass(rootTC: RootTestComponent, elIndex: number = 0) {
  let child = rootTC.componentViewChildren[elIndex];
  return expect(child && child.nativeElement && child.nativeElement.className);
}

export function getSelectedHtml(rootTC: RootTestComponent, selector: string) {
  var debugElement = rootTC.query(By.css(selector));
  return debugElement && debugElement.nativeElement && debugElement.nativeElement.innerHTML;
}

export function expectSelectedHtml(rootTC: RootTestComponent, selector: string) {
  return expect(getSelectedHtml(rootTC, selector));
}

///////// Coming in alpha-37 //////////

// src/test_lib/utils.ts
export function dispatchEvent(element: Element, eventType: string) {
  DOM.dispatchEvent(element, DOM.createEvent(eventType));
}

// Let time pass so that DOM or Ng can react
// returns a promise that returns the RootTestComponent (if it was passed int)
// after delaying for [millis] which is zero by default.
// Usage:
//     ...
//     return rootTC;  // optional
//   })
//   .then(tick)
//   .then(rootTC => { .. do something ..});
//
//   /* with non-zero delay but no rootTC */
//     ...
//   })
//   .then(rootTC => tick(rootTC, 10)) // ten milliseconds pass
//   .then(rootTC => { .. do something ..});
//
export function tick(rootTC: RootTestComponent, millis: number = 0){
  return new Promise<RootTestComponent>((resolve, reject) =>{
    setTimeout(() => resolve(rootTC), millis);
  });
}