## Other bad examples
flag = False  # It's not clear what 'flag' is indicating.
use_database = True  # It's indicating action, not a state.
red = True
x = 172800  # It's not clear what 'x' represents.


def use_database():  # noqa: F811
    database.use()  # noqa: F821


def run_a_car():
    pass


def should_run_a_car(): ...


# use_database = True


def func(callable): ...  # noqa: A002
