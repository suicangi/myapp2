//* instrumentation.js */
const { opentelemetry, trace } = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');

const { WebTracerProvider } =  
require("@opentelemetry/sdk-trace-web");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const {
   OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const {
 HTTPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

 // Optionally register automatic instrumentation libraries
 registerInstrumentations({
  instrumentations: [
  new getNodeAutoInstrumentations(),
  new HttpInstrumentation(),
  new ExpressInstrumentation({
  requestHook: (span, reqInfo) => {
             span.setAttribute('request-headers',JSON.stringify(reqInfo.req.headers))
           }
         })
     ]
    });

const resource = Resource.default().merge(
  new Resource({
    [ATTR_SERVICE_NAME]: 'custom-server',
    [ATTR_SERVICE_VERSION]: '0.1.0',
  }),
);

const provider = new WebTracerProvider({
  resource: resource,
});
const exporter = new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces", 
    //headers: {},
 })
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

provider.register();