// Ensure the module is loaded before using it
Module.onRuntimeInitialized = () => {
  const outputElement = document.getElementById("output-wasm");

  // Wrap the run_loop function
  const runLoop = Module.cwrap("run_loop", "number", ["number"]);

  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the number of iterations from the input field
    const iterations = parseInt(document.getElementById("iterations").value);

    // Clear previous output
    outputElement.textContent = "Execution time: 0 ms";

    // Capture and display execution time
    const executionTime = runLoop(iterations);
    outputElement.textContent = `Execution time: ${executionTime.toFixed(
      2
    )} ms`;
  });
};

document.getElementById("js").addEventListener("click", function () {
  const iterations = parseInt(document.getElementById("iterations").value);
  const outputElement = document.getElementById("output-js");

  // Clear previous output
  outputElement.textContent = "Execution time: 0 ms";

  // Capture and display execution time for JavaScript
  const start = performance.now();

  for (let i = 0; i < iterations; ++i) {
    console.log(`Hello from Javascript! Iteration: ${i + 1}`);
  }

  const end = performance.now();
  const duration = end - start;
  outputElement.textContent = `Execution time: ${duration.toFixed(2)} ms`;
});

Module.onRuntimeInitialized = function () {
  // Wrap the sum_primes function
  const sumPrimes = Module.cwrap("sum_primes", "string", ["number"]);

  document.getElementById("wasm-sum").addEventListener("click", function () {
    const iterations = parseInt(document.getElementById("iterations").value);
    const outputElement = document.getElementById("output-wasm2");

    // Clear previous output
    outputElement.textContent = "Sum: 0, Execution time: 0 ms";

    // Call the WebAssembly function
    const result = sumPrimes(iterations);

    // Display results
    outputElement.textContent = result;
  });
};

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

document.getElementById("js-sum").addEventListener("click", function () {
  const iterations = parseInt(document.getElementById("iterations").value);
  const outputElement = document.getElementById("output-js2");

  // Clear previous output
  outputElement.textContent = "Sum: 0, Execution time: 0 ms";

  // Start measuring time
  const start = performance.now();

  let sum = 0;
  let count = 0;
  let num = 2;

  while (count < iterations) {
    if (isPrime(num)) {
      sum += num;
      count++;
    }
    num++;
  }

  // End measuring time
  const end = performance.now();
  const duration = end - start;

  // Display results
  outputElement.textContent = `Sum: ${sum}, Execution time: ${duration.toFixed(
    2
  )} ms`;
});
