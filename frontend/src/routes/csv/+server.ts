import { json } from '@sveltejs/kit';
import { parse } from 'papaparse';


export async function POST({ request }: {request: Request}) {

  await new Promise((resolve) => {
    const result = parse('/pleindienst-BB4.csv', {
      download: false,
      delimiter: ';',
      complete: results => {
        console.log('results');
        console.log(results.data);
        resolve(true);
      }
    });
  });

  // return json({matches, times, group: data.group}, {status: 200});
  return json({}, {status: 200});
}
