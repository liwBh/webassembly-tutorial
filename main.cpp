#include <emscripten.h>
#include <iostream>
#include <chrono>
#include <cmath> // Para std::sqrt
#include <cstdio> // Para snprintf

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    double run_loop(int iterations) {
        auto start = std::chrono::high_resolution_clock::now();

        for (int i = 0; i < iterations; ++i) {
            std::cout << "Hello from WebAssembly! Iteration: " << i + 1 << std::endl;
        }

        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;
        return duration.count();
    }

    EMSCRIPTEN_KEEPALIVE
    const char* sum_primes(int n) {
        auto start = std::chrono::high_resolution_clock::now();
        double sum = 0;
        int count = 0;
        int num = 2;

        while (count < n) {
            bool is_prime = true;
            for (int i = 2; i <= std::sqrt(num); ++i) {
                if (num % i == 0) {
                    is_prime = false;
                    break;
                }
            }
            if (is_prime) {
                sum += num;
                ++count;
            }
            ++num;
        }

        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end - start;
        
        // Allocate a buffer and format the result into it
        char* result_cstr = new char[256]; // Adecuado tamaño de buffer
        snprintf(result_cstr, 256, "Sum: %.0f, Execution time: %.2f ms", sum, duration.count());

        return result_cstr;
    }
}
