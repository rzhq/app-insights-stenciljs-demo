import { Component, h } from '@stencil/core';
import appInsights from '../appinsights.service';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  throwError() {
    let foo = {};
    return foo['bar'].bar;
  }

  trackException() {
    appInsights.getAppInsights().trackException({ error: new Error('some error'), severityLevel: SeverityLevel.Error });
  }

  trackTrace() {
    appInsights.getAppInsights().trackTrace({ message: 'some trace', severityLevel: SeverityLevel.Information });
  }

  trackMetric() {
    appInsights.getAppInsights().trackMetric({ name: 'some metric', average: 42 });
  }

  trackEvent() {
    appInsights.getAppInsights().trackEvent({
      name: 'some event',
      properties: {
        prop1: 'p1',
        prop2: 'p2'
      }
    });
  }

  componentDidLoad() {
    console.log('component did load');
    // let foo = {};
    // return foo['did_load'].bar;
  }

  addCustomProperties() {
    appInsights.addCustomProperties({ customProp1: 'v1', customProp2: 'v2' })
  }

  mute() {
    appInsights.getAppInsights().addTelemetryInitializer(() => false);
  }

  render() {
    return (
      <div class="app-home">
        <p>
          Welcome to the Stencil App Starter. You can use this starter to build entire apps all with web components using Stencil! Check out our docs on{' '}
          <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

        <stencil-route-link url="/profile/stencil">
          <button>Profile page</button>
        </stencil-route-link>

        <button onClick={this.throwError}>Throw Error</button>
        <button onClick={this.trackException}>Track Exception</button>
        <button onClick={this.trackTrace}>Track Trace</button>
        <button onClick={this.trackMetric}>Track Metric</button>
        <button onClick={this.trackEvent}>Track Event</button>
        <button onClick={this.addCustomProperties}>Add Custom Props</button>
        <button onClick={this.mute}>Mute</button>
      </div>
    );
  }
}
