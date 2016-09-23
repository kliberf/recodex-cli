import Progress from 'progress';

//
// Dummy progressbar test
//

export const cmd = 'test-progress <total> [interval]';
export const description = 'Dummy test of progressbar library in Node.js';
export const action = function(total, interval = 1000) {
  const bar = new Progress(' evaluating [:bar] :percent :etas', { total: parseInt(total), width: 50 });
  const intervalHandle = setInterval(() => {
    bar.tick();
    if (--total === 0) {
      clearInterval(intervalHandle);
    }
  }, parseInt(interval));
};
