# Tutorial Basico de implementación WebAssembly

Para este ejemplo pratico se utilizara c++ como el lenguaje a compilar en WASM


### Intalaciones necesarias

- Git
- G++
- GCC
- Emscripten
- Python

### Verificación de la instalación

```
  gcc --version
```

```
  g++ --version
```

```
  emcc --version
```

```
python3 --version
```


Si usas una version de linux posiblemente tengas instadas `gcc` y  `g++`
Pero es muy probable que no tengas instalado `emcc`

### Instalacion de Emscripten

["Documentación Oficial"](https://emscripten.org/docs/getting_started/downloads.html)

1. Descarga
```
git clone https://github.com/emscripten-core/emsdk.g
```

2. Instalación
```
# Fetch the latest version of the emsdk (not needed the first time you clone)
git pull

# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh
```

3. Activar emcc de forma global
```
source ~/emsdk/emsdk_env.sh
```
Esto se realiza en el directorio de nuestro proyecto para crear los achivos `wasm`

### Crea el archivo `main.cpp` con el siguiente contenido:

```
  #include <emscripten.h>
  #include <iostream>
  #include <chrono>

  extern "C" {
      EMSCRIPTEN_KEEPALIVE
      void run_loop(int iterations) {
          auto start = std::chrono::high_resolution_clock::now();

          for (int i = 0; i < iterations; ++i) {
              std::cout << "Hello from WebAssembly! Iteration: " << i + 1 << std::endl;
          }

          auto end = std::chrono::high_resolution_clock::now();
          std::chrono::duration<double, std::milli> duration = end - start;
          std::cout << "Execution time: " << duration.count() << " ms" << std::endl;
      }
  }
```
### Crea el archivo `index.html` con el siguiente contenido:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebAssembly Example</title>
    <script src="main.js"></script>
</head>
<body>
    <h1>WebAssembly Example</h1>
    <form id="form">
        <label for="iterations">Number of iterations:</label>
        <input type="number" id="iterations" name="iterations" min="1" required>
        <button type="submit">Run</button>
    </form>
    <pre id="output"></pre>

    <script>
        const outputElement = document.getElementById('output');

        // Wrap the run_loop function
        const runLoop = Module.cwrap('run_loop', 'void', ['number']);

        document.getElementById('form').addEventListener('submit', function(event) {
            event.preventDefault();
            outputElement.textContent = '';
            const iterations = parseInt(document.getElementById('iterations').value);

            // Redirect console.log to the output element
            const originalConsoleLog = console.log;
            console.log = function(message) {
                outputElement.textContent += message + '\n';
                originalConsoleLog.apply(console, arguments);
            };

            runLoop(iterations);

            // Restore original console.log
            console.log = originalConsoleLog;
        });
    </script>
</body>
</html>

```

### Compilar el archivo `main.cpp` a WebAssembly  `main.wasm`
```
  emcc main.cpp -o main.js -s EXPORTED_FUNCTIONS='["_run_loop"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]'
```

### Servir los archivos con un servidor HTTP
```
  python3 -m http.server
```

URL: http://0.0.0.0:8000/






