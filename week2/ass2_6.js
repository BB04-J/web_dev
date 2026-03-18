
// Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.

// function wait(n) {
// }

// module.exports = wait;


function wait(n) {
    return new Promise(resolve => setTimeout(resolve , n*1000));
};
wait(5);

// ---------------------------------------------------------------
function sleep(ms) {
  return new Promise((resolve) => {
    const start = Date.now();// date.now is different from new Date() as it returns total ms fron 1 jan 1970

    while (Date.now() - start < ms) {
      
    }
    

    resolve();
  });
}

module.exports = sleep;


 // ---------------------------------------------

function wait1(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t * 1000);
  });
}

function wait2(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t * 1000);
  });
}

function wait3(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t * 1000);
  });
}

async function calculateTime(t1, t2, t3) {
  const start = Date.now();

  await Promise.all([
    wait1(t1),
    wait2(t2),
    wait3(t3)
  ]);

  const end = Date.now();
  return end - start;
}


async function calculateTime(t1, t2, t3) {
  const start = Date.now();

  await wait1(t1);
  await wait2(t2);
  await wait3(t3);

  const end = Date.now();
  return end - start;
}

module.exports = calculateTime;

