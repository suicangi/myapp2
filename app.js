const express = require('express');

const { trace } = require('@opentelemetry/api');

const promClient = require('prom-client');

const register = promClient.register;
const collectDefaultMetrics = promClient.collectDefaultMetrics;

const logger = require("./logservice")
//const products = require("./routes/products.js");

collectDefaultMetrics({
  register,
  labels: {'service': 'custom-server'}
});

const PORT = parseInt(process.env.PORT || '8080');

const app = express();

/** Create custom metrics */
const custom_metrics_views = new promClient.Counter({
    name: 'custom_views',
    help: 'Counts the number of times a custom metric is viewed',
    labelNames: ['id', 'name']
});

app.get('/custom/metrics', async (req, res) => {
    const tracer = trace.getTracer('custom-server');
    var activeSpan = tracer.startActiveSpan('metrics', (span) => {  
        span.setAttribute('foo', 'bar');
        span.end();    
    });    
    logger.log({
        level: 'info',
        message: 'What time is the testing at?'
    });
    res.set('Content-Type', 'application/json');
    res.send(await register.metrics());
});

app.get('/custom/counter', async (req, res) => {
    custom_metrics_views.labels({ id: req.query.id , name: req.query.name }).inc();
    res.set('Content-Type', 'application/json');
    res.send(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
