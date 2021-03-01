import { Rate } from 'k6/metrics';
import http from 'k6/http';

let errorRate = new Rate('errorRate');

export let options = {
  discardResponseBodies: true,
  stages: [
    { duration: '30s', target: 100 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 750 }
    { duration: '30s', target: 1000 }
  ]
};

export default function() {
  let random = Math.floor(Math.random() * 8500000);
  let res = http.get(`http://54.193.91.146/listing/${random}`);
  errorRate.add(res.status >= 400);
};