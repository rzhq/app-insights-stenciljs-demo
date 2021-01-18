import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { setErrorHandler } from '@stencil/core';

import * as O from 'fp-ts/Option';

export class Lazy<T> {
  private _value: O.Option<T> = O.none;

  public constructor(private readonly factory: () => T) {}

  public get value(): T {
    if (O.isSome(this._value)) {
      return this._value.value;
    }

    const lazyValue = this.factory();
    this._value = O.some(lazyValue);
    return lazyValue;
  }
}

export class AppInsightsService {
  public readonly appInsights: Lazy<ApplicationInsights>;

  public constructor() {
    this.appInsights = new Lazy(
      () =>
        new ApplicationInsights({
          config: {
            instrumentationKey: 'bbfb2b04-555c-495f-9b20-b352e4f2eba9',
            enableAutoRouteTracking: true,
            autoTrackPageVisitTime: true,
            maxBatchInterval: 1000,
            enableUnhandledPromiseRejectionTracking: true
          }
        })
    );
  }

  public init(): void {
    this.appInsights.value.loadAppInsights();
    setErrorHandler((err) => this.appInsightsErrorHandler(err));
  }

  public getAppInsights(): ApplicationInsights {
    return this.appInsights.value;
  }

  public addCustomProperties(properties: { [key: string]: string }): void {
    this.appInsights.value.addTelemetryInitializer((envelope) => {
      envelope.data = envelope.data ? envelope.data : {};
      for (const [k, v] of Object.entries(properties)) {
        envelope.data[k] = v;
      }
    });
  }

  private appInsightsErrorHandler(error: Error): void {
    this.appInsights.value.trackException({
      error: error,
      severityLevel: SeverityLevel.Error
    });
    // eslint-disable-next-line no-console
    const defaultStencilErrorHandler = (error) => console.error(error);
    defaultStencilErrorHandler(error);
  }
}

export default new AppInsightsService();
