import random
import time

RESULTS_FILE_NAME = "_results.txt"
UNIQUE_RESULTS_FILE_NAME = "_unique_results.txt"


def _slow_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):  # noqa: PIE808
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr


def sort(*args, **kwargs):
    return sorted(*args, **kwargs)


def _slow_prime_check(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    time.sleep(0.01)  # Simulate slow computation
    return True


def _fast_prime_check(n):
    """Check if a number is prime."""

    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):  # noqa: SIM110
        if n % i == 0:
            return False
    return True


def prime_check(*args, **kwargs):
    return _fast_prime_check(*args, **kwargs)


def _fast_make_unique(data):
    return list(set(data))


def make_unique(*args, **kwargs):
    return _fast_make_unique(*args, **kwargs)


def _slow_save_items(results, file_name):
    for item in results:
        with open(file_name, "a") as f:
            f.write(str(item) + "\n")


def _fast_save_items(results, file_name):
    with open(file_name, "a") as f:
        for result in results:
            f.write(str(result) + "\n")


def save_items(*args, **kwargs):
    return _fast_save_items(*args, **kwargs)


def process_data(data):
    primes = []
    result = []
    for item in data:
        if prime_check(item):
            result.append(f"* {str(item).rjust(6)} is prime")
            primes.append(item)
        else:
            result.append(f"  {str(item).rjust(6)}")

    save_items(result, file_name=RESULTS_FILE_NAME)
    save_items(make_unique(sort(primes)), file_name=UNIQUE_RESULTS_FILE_NAME)

    return result


def main():
    with open(RESULTS_FILE_NAME, "w") as f:
        f.write("")
    with open(UNIQUE_RESULTS_FILE_NAME, "w") as f:
        f.write("")

    number = 1000
    data = [random.randint(1, number) for _ in range(number)]  # noqa: S311

    start_time = time.time()

    sorted_data = sort(data)
    processed_data = process_data(sorted_data)  # noqa: F841

    end_time = time.time()

    print(f"Time taken: {end_time - start_time:.2f}s")


if __name__ == "__main__":
    main()
