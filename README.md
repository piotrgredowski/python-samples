[![CI](https://github.com/piotrgredowski/python-code/actions/workflows/ci.yml/badge.svg)](https://github.com/piotrgredowski/python-code/actions/workflows/ci.yml)

# My Python code samples

For talks, presentations, workshops, demos.

## Setup

### Option 1

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install pip --upgrade
pip install -e ".[dev]"
```

### Option 2

Install [uv](https://docs.astral.sh/uv/getting-started/installation/).

Run

```bash
uv sync
uv venv
```

## Commands

Test with

```bash
uv run pytest --doctest-modules src --cov src --cov-report=html
```

Or without coverage

```bash
uv run pytest --doctest-modules src
```

## Cases

- [x] `doctest`
  - [src/clock_angle](src/clock_angle)
  - [src/_pieces/calculator.py](src/_pieces/calculator.py)

- [ ] mutation tests with `mutmut`
  - [src/clock_angle](src/clock_angle)
  - [tests/clock_angle/test_clock_angle.py](tests/clock_angle/test_clock_angle.py)

- [x] `venv` and differences between `conda env` and `venv`
  - [src/about_venv/venv.md](src/about_venv/venv.md)

- presentations:
  - [Renaming on steroids with AI code assistants](.presentations/08072024_renaming_on_steroids)
  - [Local coding with LLMs](.presentations/local-coding-with-llm)

## GitHub Pages

This repository deploys `.presentations/local-coding-with-llm` to GitHub Pages
using `.github/workflows/gh-pages.yml`.

After enabling **Settings → Pages → Build and deployment → GitHub Actions**,
the presentation will be available at:

`https://<your-github-username>.github.io/<your-repository-name>/`
